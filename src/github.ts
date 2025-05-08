import { Octokit } from "octokit";
import { GitHubRepoInfo } from "./git.js";

export const searchIssues = async (repoInfo: GitHubRepoInfo, keyword: string) => {
  const octokit = await getOktoKitClient();
  const { owner, repo } = repoInfo;
  const response = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    q: keyword,
  });
  return response;
}

export const searchPullRequests = async (repoInfo: GitHubRepoInfo, q: string) => {
  const octokit = await getOktoKitClient();
  const { owner, repo } = repoInfo;
  const response = await octokit.paginate(octokit.rest.pulls.list, {
    owner,
    repo,
    q,
    state: "all",
    sort: "updated",
    direction: "desc",
  });
  return response;
}

export const getIssueComments = async (repoInfo: GitHubRepoInfo, issueNumber: number) => {
  const octokit = await getOktoKitClient();
  const { owner, repo } = repoInfo;
  const response = await octokit.paginate(octokit.rest.issues.listCommentsForRepo, {
    owner,
    repo,
    pull_number: issueNumber,
  });
  return response;
}

export const getPullRequestReviewComments = async (repoInfo: GitHubRepoInfo, pullRequestNumber: number) => {
  const octokit = await getOktoKitClient();
  const { owner, repo } = repoInfo;
  const response = await octokit.paginate(octokit.rest.pulls.listReviewCommentsForRepo, {
    owner,
    repo,
    pull_number: pullRequestNumber,
  });
  return response;
}

export const getPullRequestReviewes = async (repoInfo: GitHubRepoInfo, pullRequestNumber: number) => {
  const octokit = await getOktoKitClient();
  const { owner, repo } = repoInfo;
  const response = await octokit.paginate(octokit.rest.pulls.listReviews, {
    owner,
    repo,
    pull_number: pullRequestNumber,
  });
  return response;
}

export const getPullRequestCommentsForReview = async (repoInfo: GitHubRepoInfo, pullRequestNumber: number, reviewId: number) => {
  const octokit = await getOktoKitClient();
  const { owner, repo } = repoInfo;
  const response = await octokit.paginate(octokit.rest.pulls.listCommentsForReview, {
    owner,
    repo,
    pull_number: pullRequestNumber,
    review_id: reviewId,
  });
  return response;
}

const getOktoKitClient = async () => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  return octokit;
}
