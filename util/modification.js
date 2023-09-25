const { cleanPath } = require("./paths");

const markdownLinkRegex = /\[([^\[\]]*)\]\(([^[\]]*)\)/g;

/**
 * Takes lines of Markdown text and checks them for the precense of Markdown links.
 * If any are found, they are parsed through the path cleaning function.
 * @param {string} line A line of Markdown to clean.
 * @return {string} The cleaned line of Markdown.
 */
const cleanMarkdownLinks = (line) => {
  // Replace all Markdown links with the specified URL
  return line.replace(markdownLinkRegex, (match, linkText, linkURL) => {
    return `[${linkText}](${cleanPath(linkURL)})`;
  });
}

module.exports = {
  cleanMarkdownLinks,
};
