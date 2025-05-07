import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

import { existsSync, mkdirSync, readFile, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";

export type IssueContent = RestEndpointMethodTypes["issues"]["listForRepo"]["response"]["data"][0];
export type IssueCommentContent = RestEndpointMethodTypes["issues"]["listCommentsForRepo"]["response"]["data"][0];
export type PullRequestContent = RestEndpointMethodTypes["pulls"]["list"]["response"]["data"][0];
export type PullRequestReviewCommentContent = RestEndpointMethodTypes["pulls"]["listReviewCommentsForRepo"]["response"]["data"][0];
export type CacheKey = string | number;

export class ContentCache {
  private basePath: string;

  constructor(cachePath?: string) {
    let basePath: string;
    if (cachePath) {
      basePath = resolve(cachePath);
    } else {
      basePath = resolve(join(__dirname, "../cache"));
      if (!existsSync(basePath)) {
        mkdirSync(basePath, { recursive: true });
      }
    }    
    this.basePath = basePath;
  }

  private async get<T>(keys: CacheKey[]): Promise<T | null> {
    const filePath = join(this.basePath, ...keys.map((key) => key.toString()));
    if (existsSync(filePath)) {
      return JSON.parse(readFileSync(filePath, "utf-8")) as T;
    } else {
      return null;
    }
  }

  private async set<T>(keys: CacheKey[], content: T) {
    const filePath = join(this.basePath, ...keys.map((key) => key.toString()));
    const dirPath = dirname(filePath);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(filePath, JSON.stringify(content), "utf-8");
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
}

const globalCache = new ContentCache();

export const getCache = () => {
  return globalCache;
};
