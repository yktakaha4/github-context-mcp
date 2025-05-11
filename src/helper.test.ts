import { existsSync } from "fs";
import { createMD5Hash, createTempDirectory } from "./helper.js";
import { describe, expect, it } from "vitest";

describe("createTempDirectory", () => {
  it("should create a temporary directory", () => {
    const tempDir = createTempDirectory();
    expect(existsSync(tempDir)).toBe(true);
    expect(tempDir).toMatch(/test-\w+/);
  });

  it("should create a unique temporary directory each time", () => {
    const tempDir1 = createTempDirectory();
    const tempDir2 = createTempDirectory();
    expect(tempDir1).not.toEqual(tempDir2);
  });
});

describe("createMD5Hash", () => {
  it("should create an MD5 hash of the input string", () => {
    const input = "test";
    const hash = createMD5Hash(input);
    expect(hash).toEqual("098f6bcd4621d373cade4e832627b4f6");
  });

  it("should create the same hash for the same input", () => {
    const input = "test";
    const hash1 = createMD5Hash(input);
    const hash2 = createMD5Hash(input);
    expect(hash1).toEqual(hash2);
  });
});
