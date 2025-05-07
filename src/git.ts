import { exec } from "child_process";
import { existsSync } from "fs";
import { dirname, resolve } from "path";

export interface GitHubRepoInfo {
  owner: string;
  repo: string;
}

export const guessGitHubRepoInfo = async (filePath: string): Promise<GitHubRepoInfo> => {
  const fPath = resolve(filePath);
  if (!existsSync(fPath)) {
    throw new Error(`File path does not exist: ${fPath}`);
  }

  const fileBaseDirectoryPath = dirname(resolve(fPath));
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

export const getCommitHashes = async (filePath: string): Promise<string[]> => {
  const fPath = resolve(filePath);
  if (!existsSync(fPath)) {
    throw new Error(`File path does not exist: ${fPath}`);
  }

  const fileBaseDirectoryPath = dirname(fPath);
  if (!existsSync(fileBaseDirectoryPath)) {
    throw new Error(`File path does not exist: ${fileBaseDirectoryPath}`);
  }

  const result = await new Promise<string>((resolve, reject) => {
    exec(`git log --pretty=format:"%h" -- ${fPath}`, { cwd: fileBaseDirectoryPath }, (error, stdout) => {
      if (error) {
        reject(new Error(`failed to get git commit hashes: ${fileBaseDirectoryPath}`));
      } else {
        resolve(stdout);
      }
    });
  });

  return result.trim().split('\n').map(hash => hash.trim()).filter(hash => hash.length > 0);
}
