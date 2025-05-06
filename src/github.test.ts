import { describe, it, expect } from "vitest";
import { guessGitHubRepoInfo } from "./github";

describe("guessGitHubRepoInfo", () => {
  it("GitHubのリポジトリ情報が取得できる", async () => {
    const expected = await guessGitHubRepoInfo(__filename);
    expect(expected).toEqual({
      owner: "yktakaha4",
      repo: "github-context-mcp",
    });
  });

  it("相対パスが解決される", async () => {
    const expected = await guessGitHubRepoInfo("./src/README.md");
    expect(expected).toEqual({
      owner: "yktakaha4",
      repo: "github-context-mcp",
    });
  });

  it("gitディレクトリでないパスでエラーが発生する", async () => {
     await expect(guessGitHubRepoInfo("/dummy.txt")).rejects.toThrow("failed to get git remote URL: /");
  });
});
