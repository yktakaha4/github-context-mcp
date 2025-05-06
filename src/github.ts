import { Octokit } from "octokit";
import { GitHubRepoInfo } from "./git";

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

export const searchPullRequests = async (repoInfo: GitHubRepoInfo, keyword: string) => {
  const octokit = await getOktoKitClient();
  const { owner, repo } = repoInfo;
  const response = await octokit.paginate(octokit.rest.pulls.list, {
    owner,
    repo,
    q: keyword,
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

const getOktoKitClient = async () => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  return octokit;
}
