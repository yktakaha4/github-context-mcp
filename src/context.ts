import { getCache, PullRequestCommentForReviewContent, PullRequestContent, PullRequestReviewCommentContent, PullRequestReviewContent } from "./cache.js";
import { getCommitHashes, guessGitHubRepoInfo } from "./git.js";
import { getPullRequestCommentsForReview, getPullRequestReviewComments, getPullRequestReviewes, searchPullRequests } from "./github.js";

export interface ContextByFilePath {
  pulls: {
    pull: PullRequestContent;
    comments: PullRequestReviewCommentContent[];
    reviews: {
      review: PullRequestReviewContent;
      comments: PullRequestCommentForReviewContent[];
    }[];
  }[];
}

export const getContextByFilePath = async (filePath: string): Promise<ContextByFilePath> => {
  const cache = getCache();

  const repoInfo = await guessGitHubRepoInfo(filePath);
  const hashes = await getCommitHashes(filePath);

  if (hashes.length === 0) {
    return {
      pulls: []
    };
  }

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

      context.pulls.push({
        pull: pullRequest,
        comments: [],
        reviews: []
      });

      const reviewComments = await cache.getPullRequestReviewComments(repoInfo.owner, repoInfo.repo, pullRequest.number);
      if (reviewComments) {
        context.pulls[context.pulls.length - 1].comments = reviewComments;
      }

      const reviews = await cache.getPullRequestReviews(repoInfo.owner, repoInfo.repo, pullRequest.number);
      if (reviews) {
        for (const review of reviews) {
          const reviewCommentsForReview = await cache.getPullRequestCommentsForReview(repoInfo.owner, repoInfo.repo, pullRequest.number, review.id);
          context.pulls[context.pulls.length - 1].reviews.push({
            review,
            comments: reviewCommentsForReview || []
          });
        }
      }
    }
  } else {
    const query = hashes.join(" OR ");
    const pullRequests = await searchPullRequests(repoInfo, query);
    const pullRequestNumbers = pullRequests.map((pullRequest) => pullRequest.number);
    await cache.setPullRequestNumbers(repoInfo.owner, repoInfo.repo, hashes, pullRequestNumbers);

    for (const pullRequest of pullRequests) {
      await cache.setPullRequest(repoInfo.owner, repoInfo.repo, pullRequest.number, pullRequest);

      context.pulls.push({
        pull: pullRequest,
        comments: [],
        reviews: []
      });

      const reviewComments = await getPullRequestReviewComments(repoInfo, pullRequest.number);
      await cache.setPullRequestReviewComments(repoInfo.owner, repoInfo.repo, pullRequest.number, reviewComments);

      context.pulls[context.pulls.length - 1].comments = reviewComments;

      const reviews = await getPullRequestReviewes(repoInfo, pullRequest.number);
      await cache.setPullRequestReviews(repoInfo.owner, repoInfo.repo, pullRequest.number, reviews);

      for (const review of reviews) {
        const reviewComments = await getPullRequestCommentsForReview(repoInfo, pullRequest.number, review.id);
        await cache.setPullRequestCommentsForReview(repoInfo.owner, repoInfo.repo, pullRequest.number, review.id, reviewComments);
        context.pulls[context.pulls.length - 1].reviews.push({
          review,
          comments: reviewComments
        });
      }
    }
  }
  return context;
}
