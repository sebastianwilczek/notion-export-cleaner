const { cleanMarkdownLinks } = require("../../util/modification");

describe("cleanMarkdownLinks", () => {
  it("should not clean HTTP links", () => {
    const input = "This is a [link](https://example.com).";
    const expected = "This is a [link](https://example.com).";
    const result = cleanMarkdownLinks(input);
    expect(result).toBe(expected);
  });

  it("should clean Markdown links with Notion IDs", () => {
    const input = "Check out this [cool link](Notion Page 12345/Notion Page 67890.md).";
    const expected = "Check out this [cool link](Notion-Page/Notion-Page.md).";
    const result = cleanMarkdownLinks(input);
    expect(result).toBe(expected);
  });

  it("should clean Markdown links from CSVs", () => {
    const input = "Check out this [cool database](Notion Page 12345/Notion Database 67890.csv).";
    const expected = "Check out this [cool database](Notion-Page/Notion-Database.md).";
    const result = cleanMarkdownLinks(input);
    expect(result).toBe(expected);
  });

  it("should only clean IDs from Markdown links with other type", () => {
    const input = "Check out this [cool database](Notion Page 12345/Notion Image.png).";
    const expected = "Check out this [cool database](Notion-Page/Notion-Image.png).";
    const result = cleanMarkdownLinks(input);
    expect(result).toBe(expected);
  });
  
  it("should clean multiple Markdown links in a single line", () => {
    const input = "Here are some [cool links](Notion Page 12345/Notion Page 67890.md) and [cool databases](Notion Page 12345/Notion Database 67890.csv).";
    const expected = "Here are some [cool links](Notion-Page/Notion-Page.md) and [cool databases](Notion-Page/Notion-Database.md).";
    const result = cleanMarkdownLinks(input);
    expect(result).toBe(expected);
  });

  it("should handle a line with no Markdown links", () => {
    const input = "This line has no links.";
    const expected = "This line has no links.";
    const result = cleanMarkdownLinks(input);
    expect(result).toBe(expected);
  });

  it("should handle an empty line", () => {
    const input = "";
    const expected = "";
    const result = cleanMarkdownLinks(input);
    expect(result).toBe(expected);
  });
});
