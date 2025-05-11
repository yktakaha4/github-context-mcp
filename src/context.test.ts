import { describe, beforeEach, it, vi, expect } from "vitest";
import * as cache from "./cache.js";
import { getContextByFilePath } from "./context.js";
import { createTempDirectory, isE2ETest } from "./helper.js";

describe("getContextByFileHash", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(cache, "getCache").mockImplementation(() => {
      const tempDir = createTempDirectory();
      return new cache.ContentCache(tempDir);
    });
  });

  it.runIf(isE2ETest)("Contextが返却される", async () => {
    const result = await getContextByFilePath(__filename);
    expect(result.pulls.length).toBeGreaterThan(0);
  });
})
