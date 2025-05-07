import { beforeEach, describe } from "node:test";
import { it, expect } from "vitest";
import { ContentCache, IssueContent } from "./cache.js";
import { mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("ContentCache", () => {
  let contentCache: ContentCache;

  beforeEach(() => {
    const tempPath = mkdtempSync(join(tmpdir(), "github-context-mcp-"));
    contentCache = new ContentCache(tempPath
    );
  })

  it("should set and get issue content", async () => {
    const issueContent = {
      number: 123,
    } as IssueContent;

    await contentCache.setIssue("owner", "repo", 1, issueContent);
    const result = await contentCache.getIssue("owner", "repo", 1);

    expect(result).toEqual(issueContent);
  });
});
