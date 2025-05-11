import { ContextByFilePath } from "./context.js";

export const escapeMarkdown = (text: string | null | undefined) => {
  if (!text) {
    return "";
  }
  return text.replace(/([#*`_])/g, "\\$1");
}

export const describeContextByFilePath = ({ pulls }: ContextByFilePath) => {
  const texts: string[] = [];

  for (const { pull, comments, reviews } of pulls) {
    texts.push(`
# ${escapeMarkdown(pull.title)}

| key | value |
| --- | --- |
| pull_number | ${pull.number} |
| state | ${pull.state} |
| author | ${pull.user?.login} |
| created_at | ${pull.created_at} |
| updated_at | ${pull.updated_at} |
| closed_at | ${pull.closed_at} |
| merged_at | ${pull.merged_at} |
| url | ${pull.url} |

## Body

${escapeMarkdown(pull.body)}
`.trim());
    for (const comment of comments) {
      texts.push(`
## Comment
| key | value |
| --- | --- |
| author | ${comment.user?.login} |
| created_at | ${comment.created_at} |
| updated_at | ${comment.updated_at} |
| url | ${comment.url} |

### Body
${escapeMarkdown(comment.body)}
`.trim());
    }

    for (const { review, comments } of reviews) {
      texts.push(`
## Review
| key | value |
| --- | --- |
| author | ${review.user?.login} |
| submitted_at | ${review.submitted_at} |

### Body
${escapeMarkdown(review.body)}`.trim());
      }

      for (const comment of comments) {
        texts.push(`
### Review Comment
| key | value |
| --- | --- |
| author | ${comment.user?.login} |
| created_at | ${comment.created_at} |
| updated_at | ${comment.updated_at} |
| url | ${comment.url} |
### Body
${escapeMarkdown(comment.body)}`.trim());
    }
  }
  return texts.join("\n\n").trim();
}
