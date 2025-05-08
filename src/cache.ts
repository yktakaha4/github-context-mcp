import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

import { existsSync, mkdirSync, readFile, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";

export type PullRequestNumbers = number[];
export type IssueContent = RestEndpointMethodTypes["issues"]["listForRepo"]["response"]["data"][0];
export type IssueCommentContent = RestEndpointMethodTypes["issues"]["listCommentsForRepo"]["response"]["data"][0];
export type PullRequestContent = RestEndpointMethodTypes["pulls"]["list"]["response"]["data"][0];
export type PullRequestReviewCommentContent = RestEndpointMethodTypes["pulls"]["listReviewCommentsForRepo"]["response"]["data"][0];
export type PullRequestReviewContent = RestEndpointMethodTypes["pulls"]["listReviews"]["response"]["data"][0];
export type PullRequestCommentForReviewContent = RestEndpointMethodTypes["pulls"]["listCommentsForReview"]["response"]["data"][0];
export type CacheKey = string | number;

export class ContentCache {
  private basePath: string;

  constructor(cachePath?: string) {
    let basePath: string;
    if (cachePath) {
      basePath = resolve(cachePath);
      if (!existsSync(basePath)) {
        throw new Error(`Cache path does not exist: ${basePath}`);
      }
    } else {
      basePath = resolve(join(__dirname, "../cache"));
      if (!existsSync(basePath)) {
        mkdirSync(basePath, { recursive: true });
      }
    }
    this.basePath = basePath;
  }

  private async get<T>(keys: CacheKey[]): Promise<T | null> {
    const filePath = join(this.basePath, ...keys.map((key) => key.toString())) + ".json";
    if (existsSync(filePath)) {
      return JSON.parse(readFileSync(filePath, "utf-8")) as T;
    } else {
      return null;
    }
  }

  private async set<T>(keys: CacheKey[], content: T) {
    const filePath = join(this.basePath, ...keys.map((key) => key.toString())) + ".json";
    const dirPath = dirname(filePath);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");
  }

  public async getPullRequestNumbers(owner: string, repo: string, fileHashes: string[]) {
    if (fileHashes.length === 0) {
      throw new Error("File hashes cannot be empty");
    }

    const key = [owner, repo, "file_path_hashes", fileHashes.join("-")];
    return await this.get<PullRequestNumbers>(key);
  }

  public async setPullRequestNumbers(owner: string, repo: string, fileHashes: string[], numbers: PullRequestNumbers) {
    if (fileHashes.length === 0) {
      throw new Error("File hashes cannot be empty");
    }

    const key = [owner, repo, "file_path_hashes", fileHashes.join("-")];
    await this.set(key, numbers);
  }

  public async getIssue(owner: string, repo: string, number: number) {
    const key = [owner, repo, "issues", number];
    return await this.get<IssueContent>(key);
  }

  public async setIssue(owner: string, repo: string, number: number, content: IssueContent) {
    const key = [owner, repo, "issues", number];
    await this.set(key, content);
  }

  public async getIssueComments(owner: string, repo: string, number: number) {
    const key = [owner, repo, "issues", number, "comments"];
    return await this.get<IssueCommentContent[]>(key);
  }

  public async setIssueComments(owner: string, repo: string, number: number, content: IssueCommentContent[]) {
    const key = [owner, repo, "issues", number, "comments"];
    await this.set(key, content);
  }

  public async getPullRequest(owner: string, repo: string, number: number) {
    const key = [owner, repo, "pull_requests", number];
    return await this.get<PullRequestContent>(key);
  }

  public async setPullRequest(owner: string, repo: string, number: number, content: PullRequestContent) {
    const key = [owner, repo, "pull_requests", number];
    await this.set(key, content);
  }

  public async getPullRequestReviewComments(owner: string, repo: string, number: number) {
    const key = [owner, repo, "pull_requests", number, "comments"];
    return await this.get<PullRequestReviewCommentContent[]>(key);
  }

  public async setPullRequestReviewComments(owner: string, repo: string, number: number, content: PullRequestReviewCommentContent[]) {
    const key = [owner, repo, "pull_requests", number, "comments"];
    await this.set(key, content);
  }

  public async getPullRequestReviews(owner: string, repo: string, number: number) {
    const key = [owner, repo, "pull_requests", number, "reviews"];
    return await this.get<PullRequestReviewContent[]>(key);
  }

  public async setPullRequestReviews(owner: string, repo: string, number: number, content: PullRequestReviewContent[]) {
    const key = [owner, repo, "pull_requests", number, "reviews"];
    await this.set(key, content);
  }

  public async getPullRequestCommentsForReview(owner: string, repo: string, number: number, reviewId: number) {
    const key = [owner, repo, "pull_requests", number, "reviews", reviewId, "comments"];
    return await this.get<PullRequestCommentForReviewContent[]>(key);
  }

  public async setPullRequestCommentsForReview(owner: string, repo: string, number: number, reviewId: number, content: PullRequestCommentForReviewContent[]) {
    const key = [owner, repo, "pull_requests", number, "reviews", reviewId, "comments"];
    await this.set(key, content);
  }
}

const globalCache = new ContentCache();

export const getCache = () => {
  return globalCache;
};
