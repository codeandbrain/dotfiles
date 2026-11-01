import test from 'node:test';
import assert from 'node:assert/strict';
import { markArchived } from './workspace';
import type { Repository } from './github';

const repo = (id: number): Repository => ({
  id, name: `r${id}`, full_name: `o/r${id}`, private: false, language: null,
  stargazers_count: 0, forks_count: 0, updated_at: '2026-10-01T00:00:00Z', html_url: 'https://github.com/o',
});

test('flags only repositories that were really archived', () => {
  const input = [repo(1), repo(2), repo(3)];
  const result = markArchived(input, new Set([2]));
  assert.deepEqual(result.map((r) => r.archived === true), [false, true, false]);
});

test('does not change the input and leaves everything alone when nothing succeeded', () => {
  const input = [repo(1), repo(2)];
  const result = markArchived(input, new Set());
  assert.deepEqual(result, input);
  assert.equal(input[0].archived, undefined);
});
