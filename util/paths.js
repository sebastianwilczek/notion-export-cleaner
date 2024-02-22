/**
 * Replaces the IDs in the paths as put in place by Notion.
 * Also replaces the spaces in the paths with dashes, as well as removing any illegal characters.
 * @param {string} path The path to clean.
 * @return {string} The cleaned path.
 */
const cleanPath = (path) => {
  const pathWithoutSpaceEscapes = path.trim().replace(/%20/g, " ");
  const pathWithoutSpaces = pathWithoutSpaceEscapes.replace(/\s(?=\S*(\/|$))/g, "TOBEREPLACED").replace(/ /g, "-").replace(/TOBEREPLACED/g, " ");
  const pathWithoutMd = pathWithoutSpaces.replace(/ (\S*?)\.md$/, ".md");
  const pathWithoutCsv = pathWithoutMd.replace(/ (\S*?)\.csv$/, ".md");
  const pathWithoutIds = pathWithoutCsv.replace(/([^/]+) ([^/]+)\//g, "$1/");
  const pathWithoutIllegalPathCharacters = pathWithoutIds.replace(/ /g, "-").replace(/[^a-zA-Z0-9-/.]/g, "");
  const pathWithoutMultipleDashes = pathWithoutIllegalPathCharacters.replace(/-{2,}/g, "-");
  return pathWithoutMultipleDashes;
};

module.exports = {
  cleanPath,
};
