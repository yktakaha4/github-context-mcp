import { beforeEach, describe, expect, it } from "vitest";
import { ContentCache, IssueContent } from "./cache.js";
import { createTempDirectory } from "./helper.js";

describe("ContentCache", () => {
  let contentCache: ContentCache;

  beforeEach(() => {
    const tempPath = createTempDirectory();
    contentCache = new ContentCache(tempPath);
  });

  it("should set and get issue content", async () => {
    const issueContent = {
      number: 123,
    } as IssueContent;

    const nothing = await contentCache.getIssue("owner", "repo", 1);
    expect(nothing).toBeNull();

    await contentCache.setIssue("owner", "repo", 1, issueContent);
    const result = await contentCache.getIssue("owner", "repo", 1);

    expect(result).toEqual(issueContent);
  });
});
