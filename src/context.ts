import { getCache, PullRequestContent, PullRequestReviewCommentContent } from "./cache.js";
import { getCommitHashes, guessGitHubRepoInfo } from "./git.js";
import { getPullRequestReviewComments, searchPullRequests } from "./github.js";

export interface ContextByFilePath {
  pulls: {
    pull: PullRequestContent;
    comments: PullRequestReviewCommentContent[];
  }[];
}

export const getContextByFilePath = async (filePath: string): Promise<ContextByFilePath> => {
  const cache = getCache();

  const repoInfo = await guessGitHubRepoInfo(filePath);
  const hashes = await getCommitHashes(filePath);

  const context: ContextByFilePath = {
    pulls: []
  };

  const pullRequestNumbers = await cache.getPullRequestNumbers(repoInfo.owner, repoInfo.repo, hashes);
  if (pullRequestNumbers) {
    for (const number of pullRequestNumbers) {
      const pullRequest = await cache.getPullRequest(repoInfo.owner, repoInfo.repo, number);
      if (!pullRequest) {
        continue;
      }
      const reviewComments = await cache.getPullRequestReviewComments(repoInfo.owner, repoInfo.repo, pullRequest.number);
      context.pulls.push({
        pull: pullRequest,
        comments: reviewComments || []
      });
    }
  } else {
    const query = hashes.join(" OR ");
    const pullRequests = await searchPullRequests(repoInfo, query);
    const pullRequestNumbers = pullRequests.map((pullRequest) => pullRequest.number);
    await cache.setPullRequestNumbers(repoInfo.owner, repoInfo.repo, hashes, pullRequestNumbers);

    for (const pullRequest of pullRequests) {
      await cache.setPullRequest(repoInfo.owner, repoInfo.repo, pullRequest.number, pullRequest);

      const reviewComments = await getPullRequestReviewComments(repoInfo, pullRequest.number);
      await cache.setPullRequestReviewComments(repoInfo.owner, repoInfo.repo, pullRequest.number, reviewComments);

      context.pulls.push({
        pull: pullRequest,
        comments: reviewComments || []
      });
    }
  }
  return context;
}
