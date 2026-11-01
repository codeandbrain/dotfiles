import test from 'node:test';
import assert from 'node:assert/strict';
import { activitiesToCsv } from './workspace';

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
