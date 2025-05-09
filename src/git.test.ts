import { describe, it, expect } from "vitest";
import { getCommitHashes, guessGitHubRepoInfo } from "./git.js";

describe("guessGitHubRepoInfo", () => {
  it("GitHubのリポジトリ情報が取得できる", async () => {
    const expected = await guessGitHubRepoInfo(__filename);
    expect(expected).toEqual({
      owner: "yktakaha4",
      repo: "github-context-mcp",
    });
  });

  it("相対パスが解決される", async () => {
    const expected = await guessGitHubRepoInfo("./README.md");
    expect(expected).toEqual({
      owner: "yktakaha4",
      repo: "github-context-mcp",
    });
  });

  it("無効なパスでエラーが発生する", async () => {
    await expect(guessGitHubRepoInfo("invalid/path.txt")).rejects.toThrow(/^File path does not exist:/);
  });

  it("無効なパスでエラーが発生する", async () => {
    await expect(guessGitHubRepoInfo("/tmp/")).rejects.toThrow(/^failed to get git remote URL:/);
  });
});

describe("getCommitHashes", () => {
  it("コミットハッシュが取得できる", async () => {
    const expected = await getCommitHashes(__filename);
      expect(expected.length).toBeGreaterThan(0);
      expect(expected[0]).toMatch(/^[0-9a-f]{7}$/);
  });

  it("相対パスが解決される", async () => {
    const expected = await getCommitHashes("./README.md");
      expect(expected.length).toBeGreaterThan(0);
  });

  it("無効なパスでエラーが発生する", async () => {
    await expect(getCommitHashes("invalid/path.txt")).rejects.toThrow(/^File path does not exist:/);
  });

  it("無効なパスでエラーが発生する", async () => {
    await expect(getCommitHashes("/tmp/")).rejects.toThrow(/^failed to get git commit hashes:/);
  });
});
