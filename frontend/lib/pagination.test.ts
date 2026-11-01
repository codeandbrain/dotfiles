import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_PAGES, parseNextLink } from './pagination';

test('returns null when there is no Link header', () => {
  assert.equal(parseNextLink(null), null);
  assert.equal(parseNextLink(''), null);
});

test('finds rel="next" even when the URL contains commas', () => {
  const header =
    '<https://api.github.com/user/repos?per_page=100&affiliation=owner,collaborator,organization_member&page=2>; rel="next", ' +
    '<https://api.github.com/user/repos?per_page=100&affiliation=owner,collaborator,organization_member&page=5>; rel="last"';
  assert.equal(
    parseNextLink(header),
    'https://api.github.com/user/repos?per_page=100&affiliation=owner,collaborator,organization_member&page=2',
  );
});

test('returns null on the last page (prev and first only)', () => {
  const header = '<https://api.github.com/user/orgs?page=1>; rel="prev", <https://api.github.com/user/orgs?page=1>; rel="first"';
  assert.equal(parseNextLink(header), null);
});

test('never follows a next link that leaves https://api.github.com', () => {
  assert.equal(parseNextLink('<https://evil.example/steal?page=2>; rel="next"'), null);
  assert.equal(parseNextLink('<http://api.github.com/user/repos?page=2>; rel="next"'), null);
  assert.equal(parseNextLink('<https://api.github.com.evil.example/user/repos?page=2>; rel="next"'), null);
  assert.equal(parseNextLink('<not a url>; rel="next"'), null);
});

test('page cap is a sane bound', () => {
  assert.ok(Number.isInteger(MAX_PAGES) && MAX_PAGES >= 1 && MAX_PAGES <= 20);
});
