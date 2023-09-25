const { cleanPath } = require("./paths");
const csv = require("csv-parser");
const path = require("path");
const fs = require("fs");

/**
 * Parses the given directory and returns an array of paths to Markdown files.
 * @param {string} sourceDir The directory to search for Markdown files.
 * @param {string} extension The extension of the files to search for.
 * @return {string[]} An array of paths to Markdown files.
 */
const getAllFilesWithExtension = async (sourceDir, extension) => {
  const files = await fs.promises.readdir(sourceDir);
  const markdownFiles = [];

  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      markdownFiles.push(...await getAllFilesWithExtension(filePath, extension));
    } else if (path.extname(file) === extension) {
      markdownFiles.push(filePath);
    } else if (!extension) {
      markdownFiles.push(filePath);
    }
  }

  return markdownFiles;
}

/**
 * Processes the given file and writes the result to the given destination.
 * Processes the file line by line with the given processors.
 * If no processors are given, the file is copied to the destination.
 * @param {string} sourcePath The path to the file to process.
 * @param {string} destPath The path to write the processed file to.
 * @param {function[]} processors An array of functions to process the file lines with.
 * @return {Promise<void>} A promise that resolves when the file has been processed.
 */
const processFile = async (sourcePath, destPath, processors) => {
  const destDir = path.dirname(destPath);
  fs.mkdir(destDir, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating destination directory:", err);
    } else {
      if (processors.length === 0) {
        fs.copyFile(sourcePath, destPath, (err) => {
          if (err) {
            console.error("Error copying the file:", err);
            return;
          }
        });
        return;
      }

      fs.readFile(sourcePath, "utf8", (inputErr, data) => {
        if (inputErr) {
          console.error("Error reading the file:", inputErr);
          return;
        }
        const lines = data.split("\n");
        const modifiedLines = lines.map(line => {
          let modifiedLine = line;
          processors.forEach((processor, index) => {
            modifiedLine = processor(modifiedLine, index);
          });
          return modifiedLine;
        });
        const modifiedText = modifiedLines.join("\n");
        fs.writeFile(destPath, modifiedText, "utf8", err => {
          if (err) {
            console.error("Error writing to the file:", err);
            return;
          }
        });
      });
    }
  });
}

/**
 * Converts the given CSV file to a Markdown file.
 * The first row of the CSV file is expected to be the header row.
 * The first column of the CSV file is expected to be the Name link, as CSV files are generated based on Notion databases.
 * @param {string} sourcePath The path to the file to process.
 * @param {string} destPath The path to write the processed file to.
 * @return {Promise<void>} A promise that resolves when the file has been processed.
 */
const convertCsvToMarkdown = async (sourcePath, destPath) => {
  const destDir = path.dirname(destPath);
  fs.mkdir(destDir, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating destination directory:", err);
    } else {
      fs.createReadStream(sourcePath)
        .pipe(csv())
        .on("headers", (headers) => {
          const mdHeaders = `| ${headers.join(" | ")} |`;
          fs.appendFileSync(destPath, mdHeaders + "\n");
          const mdSeparators = `| ${headers.map(() => "---").join(" | ")} |`;
          fs.appendFileSync(destPath, mdSeparators + "\n");
        })
        .on("data", (row) => {
          const mdRow = `| ${Object.values(row)
            .map((value, index) => {
              if (index === 0) {
                const directoryName = destPath.split("/").pop().replace(".md", "");
                return `[${value}](${directoryName}/${cleanPath(value)}.md)`;
              }
              return value;
            })
            .join(" | ")
            .replace(
              /\n/g,
              "<br />"
            )} |`;
          fs.appendFileSync(destPath, mdRow + "\n");
        });
    }
  });
}

module.exports = {
  getAllFilesWithExtension,
  processFile,
  convertCsvToMarkdown,
};
