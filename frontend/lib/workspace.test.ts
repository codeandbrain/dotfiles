import test from 'node:test';
import assert from 'node:assert/strict';
import { activitiesToCsv, filterRepositories } from './workspace';
import type { Repository } from './github';

const repositories: Repository[] = [
  { id: 1, name: 'public-app', full_name: 'ariful/public-app', private: false, language: 'TypeScript', stargazers_count: 4, forks_count: 0, updated_at: '2026-10-03T10:00:00Z', html_url: 'https://github.com/ariful/public-app' },
  { id: 2, name: 'private-tool', full_name: 'health-lab/private-tool', private: true, language: 'Python', stargazers_count: 8, forks_count: 0, updated_at: '2026-10-02T10:00:00Z', html_url: 'https://github.com/health-lab/private-tool' },
  { id: 3, name: 'archived-public', full_name: 'ariful/archived-public', private: false, language: 'TypeScript', stargazers_count: 1, forks_count: 0, updated_at: '2026-10-01T10:00:00Z', html_url: 'https://github.com/ariful/archived-public', archived: true },
];

test('filters repositories by visibility and excludes archived rows by default', () => {
  const base = { query: '', organizations: [], language: '', includeArchived: false, sort: 'updated' as const };
  assert.deepEqual(filterRepositories(repositories, { ...base, visibility: 'public' }).map((repo) => repo.name), ['public-app']);
  assert.deepEqual(filterRepositories(repositories, { ...base, visibility: 'private' }).map((repo) => repo.name), ['private-tool']);
  assert.deepEqual(filterRepositories(repositories, { ...base, visibility: 'all', includeArchived: true }).map((repo) => repo.name), ['public-app', 'private-tool', 'archived-public']);
});

test('exports activity rows as escaped CSV', () => {
  const csv = activitiesToCsv([
    { title: 'Repository visibility reviewed', detail: 'community-health-dashboard', time: 'Today, 10:42 AM' },
    { title: 'Member invited', detail: 'health-data-lab, pending', time: 'Yesterday' },
  ]);
  assert.equal(csv, [
    '"activity","detail","time"',
    '"Repository visibility reviewed","community-health-dashboard","Today, 10:42 AM"',
    '"Member invited","health-data-lab, pending","Yesterday"',
  ].join('\n'));
});
