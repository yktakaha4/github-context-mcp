import { exec } from "child_process";
import { existsSync } from "fs";
import { dirname, resolve } from "path";
import { Octokit } from "octokit";

export interface GitHubRepoInfo {
  owner: string;
  repo: string;
}

export const guessGitHubRepoInfo = async (filePath: string): Promise<GitHubRepoInfo> => {
  const fileBaseDirectoryPath = dirname(resolve(filePath));
  if (!existsSync(fileBaseDirectoryPath)) {
    throw new Error(`File path does not exist: ${fileBaseDirectoryPath}`);
  }

  const result = await new Promise<string>((resolve, reject) => {
    exec('git config --get remote.origin.url', { cwd: fileBaseDirectoryPath }, (error, stdout) => {
      if (error) {
        reject(new Error(`failed to get git remote URL: ${fileBaseDirectoryPath}`));
      } else {
        resolve(stdout);
      }
    });
  });

  const url = result.trim();
  const match = url.match(/github\.com[:\/](.+?)\/(.+?)(\.git)?$/);
  if (match) {
    const owner = match[1];
    const repo = match[2];
    return { owner, repo };
  } else {
    throw new Error(`Could not parse GitHub URL: ${url}`);
  }
}

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

const getOktoKitClient = async () => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  return octokit;
}
