import { Octokit } from "octokit";
import { GitHubRepoInfo } from "./git.js";

export const searchIssues = async (repoInfo: GitHubRepoInfo, keyword: string) => {
  const octokit = await getOctoKitClient();
  const { owner, repo } = repoInfo;
  console.error("searchIssues", repoInfo, keyword);
  const response = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    q: keyword,
    per_page: 100,
  });
  return response;
}

export const searchPullRequests = async (repoInfo: GitHubRepoInfo, q: string) => {
  const octokit = await getOctoKitClient();
  const { owner, repo } = repoInfo;
  console.error("searchPullRequests", repoInfo, q);
  const response = await octokit.paginate(octokit.rest.pulls.list, {
    owner,
    repo,
    q,
    state: "all",
    sort: "updated",
    direction: "desc",
    per_page: 100,
  });
  console.error("searchPullRequests", response.length);
  return response;
}

export const getIssueComments = async (repoInfo: GitHubRepoInfo, issueNumber: number) => {
  const octokit = await getOctoKitClient();
  const { owner, repo } = repoInfo;
  console.error("getIssueComments", repoInfo, issueNumber);
  const response = await octokit.paginate(octokit.rest.issues.listCommentsForRepo, {
    owner,
    repo,
    pull_number: issueNumber,
    per_page: 100,
  });
  console.error("getIssueComments", response.length);
  return response;
}

export const getPullRequestReviewComments = async (repoInfo: GitHubRepoInfo, pullRequestNumber: number) => {
  const octokit = await getOctoKitClient();
  const { owner, repo } = repoInfo;
  console.error("getPullRequestReviewComments", repoInfo, pullRequestNumber);
  const response = await octokit.paginate(octokit.rest.pulls.listReviewCommentsForRepo, {
    owner,
    repo,
    pull_number: pullRequestNumber,
    per_page: 100,
  });
  console.error("getPullRequestReviewComments", response.length);
  return response;
}

export const getPullRequestReviewes = async (repoInfo: GitHubRepoInfo, pullRequestNumber: number) => {
  const octokit = await getOctoKitClient();
  const { owner, repo } = repoInfo;
  console.error("getPullRequestReviewes", repoInfo, pullRequestNumber);
  const response = await octokit.paginate(octokit.rest.pulls.listReviews, {
    owner,
    repo,
    pull_number: pullRequestNumber,
    per_page: 100,
  });
  console.error("getPullRequestReviewes", response.length);
  return response;
}

export const getPullRequestCommentsForReview = async (repoInfo: GitHubRepoInfo, pullRequestNumber: number, reviewId: number) => {
  const octokit = await getOctoKitClient();
  const { owner, repo } = repoInfo;
  console.error("getPullRequestCommentsForReview", repoInfo, pullRequestNumber, reviewId);
  const response = await octokit.paginate(octokit.rest.pulls.listCommentsForReview, {
    owner,
    repo,
    pull_number: pullRequestNumber,
    review_id: reviewId,
    per_page: 100,
  });
  console.error("getPullRequestCommentsForReview", response.length);
  return response;
}

export const getOctoKitClient = async () => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  return octokit;
}
