import { describe, beforeEach, it, vi } from "vitest";
import * as cache from "./cache.js";
import { getContextByFilePath } from "./context.js";
import { createTempDirectory } from "./helper.js";

describe("getContextByFileHash", () => {
  beforeEach(() => {
    // vi.spyOn(cache, "getCache").mockImplementation(() => {
    //   const tempDir = createTempDirectory();
    //   return new cache.ContentCache(tempDir);
    // });
  });

  it("should return the correct context for the given file path", async () => {
    const result = await getContextByFilePath(__filename);
  });
})
