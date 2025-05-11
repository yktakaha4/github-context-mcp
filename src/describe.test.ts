import { describe, it, expect } from 'vitest'
import { describeContextByFilePath } from './describe.js';
import { PullRequestContent } from './cache.js';

describe('describeContextByFilePath', () => {
  it('文字がテキスト出力される', () => {
    const actual = describeContextByFilePath({
      pulls: [{
        pull: {
          number: 1,
          state: 'open',
          title: 'my test pull request',
          user: {
            login: 'yktakaha4',
          },
          created_at: '2023-10-01T00:00:00Z',
          updated_at: '2023-10-01T00:00:00Z',
          closed_at: null,
          merged_at: null,
          url: 'https://example.com/pull/1',
          body: 'This is a test pull request.',
        } as PullRequestContent,
        comments: [],
        reviews: [],
      }],
    });
    expect(actual).toContain('my test pull request');
  });
});
