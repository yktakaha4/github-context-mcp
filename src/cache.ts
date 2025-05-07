import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

import Cache, { FileSystemCache } from "file-system-cache";
import { existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";

export type IssueContent = RestEndpointMethodTypes["issues"]["listForRepo"]["response"]["data"][0];
export type IssueCommentContent = RestEndpointMethodTypes["issues"]["listCommentsForRepo"]["response"]["data"][0];
export type PullRequestContent = RestEndpointMethodTypes["pulls"]["list"]["response"]["data"][0];
export type PullRequestReviewCommentContent = RestEndpointMethodTypes["pulls"]["listReviewCommentsForRepo"]["response"]["data"][0];

export class ContentCache {
  private cache: FileSystemCache;

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
    this.cache = Cache({
      basePath,
    });
  }

  public async getIssue(owner: string, repo: string, number: number) {
    const key = [owner, repo, "issues", number].join("/");
    return await this.cache.get(key) as IssueContent;
  }

  public async setIssue(owner: string, repo: string, number: number, content: IssueContent) {
    const key = [owner, repo, "issues", number].join("/");
    await this.cache.set(key, content);
  }

  public async getIssueComments(owner: string, repo: string, number: number) {
    const key = [owner, repo, "issues", number, "comments"].join("/");
    return await this.cache.get(key) as IssueCommentContent[];
  }

  public async setIssueComments(owner: string, repo: string, number: number, content: IssueCommentContent[]) {
    const key = [owner, repo, "issues", number, "comments"].join("/");
    await this.cache.set(key, content);
  }

  public async getPullRequest(owner: string, repo: string, number: number) {
    const key = [owner, repo, "pull_requests", number].join("/")
    return await this.cache.get(key) as PullRequestContent;
  }

  public async setPullRequest(owner: string, repo: string, number: number, content: PullRequestContent) {
    const key = [owner, repo, "pull_requests", number].join("/")
    await this.cache.set(key, content);
  }

  public async getPullRequestReviewComments(owner: string, repo: string, number: number) {
    const key = [owner, repo, "pull_requests", number, "comments"].join("/");
    return await this.cache.get(key) as PullRequestReviewCommentContent[];
  }

  public async setPullRequestReviewComments(owner: string, repo: string, number: number, content: PullRequestReviewCommentContent[]) {
    const key = [owner, repo, "pull_requests", number, "comments"].join("/");
    await this.cache.set(key, content);
  }
}

const globalCache = new ContentCache();

export const getCache = () => {
  return globalCache;
};
