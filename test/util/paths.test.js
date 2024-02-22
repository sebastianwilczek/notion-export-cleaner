const { cleanPath } = require("../../util/paths");

describe("cleanPath", () => {
  it("should handle paths with Notion-style IDs", () => {
    const path = "My Notion Page 12345/My file 12345.md";
    const expected = "My-Notion-Page/My-file.md";
    const result = cleanPath(path);
    expect(result).toBe(expected);
  });
  
  it("should replace spaces with dashes and remove illegal characters", () => {
    const path = "my Notion file with spaces & special chars 12345.csv";
    const expected = "my-Notion-file-with-spaces-special-chars.md";
    const result = cleanPath(path);
    expect(result).toBe(expected);
  });

  it("should remove .md extension from paths ending with .md", () => {
    const path = "file with spaces 12345.md";
    const expected = "file-with-spaces.md";
    const result = cleanPath(path);
    expect(result).toBe(expected);
  });

  it("should replace .csv extension with .md", () => {
    const path = "file with spaces 12345.csv";
    const expected = "file-with-spaces.md";
    const result = cleanPath(path);
    expect(result).toBe(expected);
  });

  it("should replace multiple consecutive spaces with a single dash", () => {
    const path = "file   with    multiple    spaces 12345.md";
    const expected = "file-with-multiple-spaces.md";
    const result = cleanPath(path);
    expect(result).toBe(expected);
  });

  it("should replace space-escaped %20 with dashes", () => {
    const path = "my%20file%20with%20spaces 12345.md";
    const expected = "my-file-with-spaces.md";
    const result = cleanPath(path);
    expect(result).toBe(expected);
  });

  it("should remove illegal characters", () => {
    const path = "file$with*illegal^characters! 12345.md";
    const expected = "filewithillegalcharacters.md";
    const result = cleanPath(path);
    expect(result).toBe(expected);
  });

  it("should handle empty path", () => {
    const path = "";
    const expected = "";
    const result = cleanPath(path);
    expect(result).toBe(expected);
  });

  it("should handle paths without spaces, special characters, or extensions", () => {
    const path = "simplepath";
    const expected = "simplepath";
    const result = cleanPath(path);
    expect(result).toBe(expected);
  });

  it("should handle paths with multiple directories, special characters, spaces, markdown file", () => {
    const path = "This is a directory 123/This is & another directory 123/My Notion file with spaces & special chars 12345.md";
    const expected = "This-is-a-directory/This-is-another-directory/My-Notion-file-with-spaces-special-chars.md";
    const result = cleanPath(path);
    expect(result).toBe(expected);
  });

  it("should handle paths with multiple directories, special characters, spaces, CSV file", () => {
    const path = "This is a directory 123/This is & another directory 123/My Notion file with spaces & special chars 12345.csv";
    const expected = "This-is-a-directory/This-is-another-directory/My-Notion-file-with-spaces-special-chars.md";
    const result = cleanPath(path);
    expect(result).toBe(expected);
  });

  it("should handle paths with multiple directories, special characters, spaces, any file", () => {
    const path = "This is a directory 123/This is & another directory 123/My Notion file with spaces & special chars 12345.html";
    const expected = "This-is-a-directory/This-is-another-directory/My-Notion-file-with-spaces-special-chars-12345.html";
    const result = cleanPath(path);
    expect(result).toBe(expected);
  });
});
