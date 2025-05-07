import { getCache } from "./cache.js";
import { getCommitHashes, guessGitHubRepoInfo } from "./git.js";
import { getPullRequestReviewComments, searchPullRequests } from "./github.js";


export const getContextByFilePath = async (filePath: string): Promise<string> => {
  const cache = getCache();

  const repoInfo = await guessGitHubRepoInfo(filePath);
  const hashes = await getCommitHashes(filePath);

  const filePathHashesCacheKey = `${repoInfo.owner}/${repoInfo.repo}/file_path_hashes/${hashes.join("-")}`;
  if (!cache.fileExists(filePathHashesCacheKey)) {
    const query = hashes.join(" OR ");
    const pullRequests = await searchPullRequests(repoInfo, query);

    cache.set(filePathHashesCacheKey, pullRequests.map(({ number }) => number));

    for (const pullRequest of pullRequests) {
      const pullRequestCacheKey = `${repoInfo.owner}/${repoInfo.repo}/pull_requests/${pullRequest.number}`;
      cache.set(pullRequestCacheKey, pullRequest);
  
      const pullRequestCommentCacheKey = `${pullRequestCacheKey}/comments`;
  
      if (!cache.fileExists(pullRequestCommentCacheKey)) {
        const reviewComments = await getPullRequestReviewComments(repoInfo, pullRequest.number);
        cache.set(pullRequestCommentCacheKey, reviewComments);
      }
    }
  }
  return "";
}
