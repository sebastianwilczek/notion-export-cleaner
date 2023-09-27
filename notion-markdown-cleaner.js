#!/usr/bin/env node
const { getAllFilesWithExtension, processFile, convertCsvToMarkdown } = require("./util/files");
const { cleanMarkdownLinks } = require("./util/modification");
const { cleanPath } = require("./util/paths");
const nodePath = require("path");

const sourceDir = process.argv[2];
const destDir = process.argv[3];

/**
 * Checks if both a source and destination directory were provided.
 */
if (!sourceDir || !destDir) {
  console.error("Usage: notion-markdown-cleaner <source_directory> <destination_directory>");
  process.exit(1);
}

(async () => {
  try {
    // Process and copy all CSV files
    const csvFiles = (await getAllFilesWithExtension(sourceDir, ".csv"))
      .filter(path => !path.includes("_all.csv"));
    csvFiles.forEach(path => {
      const cleanedPath = path.replace(sourceDir, "");
      console.log(`- ${cleanedPath}`);
      const result = cleanPath(cleanedPath);
      console.log("\x1b[31m%s\x1b[0m", `+ ${result}`);
      convertCsvToMarkdown(
        path,
        nodePath.join(destDir, result),
      );
    });

    // Process and copy all Markdown files
    const markdownFiles = await getAllFilesWithExtension(sourceDir, ".md");
    markdownFiles.forEach(path => {
      const cleanedPath = path.replace(sourceDir, "");
      console.log(`- ${cleanedPath}`);
      const result = cleanPath(cleanedPath);
      console.log("\x1b[33m%s\x1b[0m", `+ ${result}`);
      processFile(
        path,
        nodePath.join(destDir, result),
        [
          cleanMarkdownLinks,
        ]
      );
    });

    // Copy all other files
    const otherFiles = (await getAllFilesWithExtension(sourceDir, null))
      .filter(path => !path.includes(".csv") &&
              !path.includes(".md") &&
              !path.includes(".DSStore"));
    otherFiles.forEach(path => {
      const cleanedPath = path.replace(sourceDir, "");
      console.log(`- ${cleanedPath}`);
      const result = cleanPath(cleanedPath);
      console.log("\x1b[32m%s\x1b[0m", `+ ${result}`);
      processFile(
        path,
        nodePath.join(destDir, result),
        []
      );
    });
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
})();
