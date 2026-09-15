import test from 'node:test';
import assert from 'node:assert/strict';
import { isPublic, visibleEntries, validateRelations } from '../src/lib/publication.mjs';

const now = new Date('2026-09-14T12:00:00Z');
const entry = (id, overrides = {}) => ({
  id,
  data: {
    slug: id,
    draft: false,
    placeholder: false,
    publication_date: '2026-09-13',
    pillar: { id: 'self' },
    ...overrides,
  },
});
test('unapproved and future content never enters public lists', () => {
  const entries = [
    entry('public'),
    entry('draft', { draft: true }),
    entry('placeholder', { placeholder: true }),
    entry('future', { publication_date: '2027-01-01' }),
  ];
  assert.deepEqual(
    visibleEntries(entries, false, now).map((a) => a.id),
    ['public'],
  );
  assert.equal(visibleEntries(entries, true, now).length, 4);
  assert.equal(isPublic(entry('invalid', { publication_date: 'invalid' }), now), false);
});
test('publication time boundary is inclusive and ordering stable', () => {
  assert.equal(isPublic(entry('now', { publication_date: now.toISOString() }), now), true);
  assert.deepEqual(
    visibleEntries([entry('z'), entry('a')], false, now).map((a) => a.id),
    ['a', 'z'],
  );
});
test('invalid references and duplicate slugs fail validation', () => {
  const problems = validateRelations(
    [
      entry('first', { slug: 'same', related_articles: [{ id: 'missing' }] }),
      entry('second', { slug: 'same', pillar: { id: 'missing' } }),
    ],
    [],
    [{ id: 'self' }],
  );
  assert.equal(problems.length, 3);
});
test('only one published article can be featured, drafts do not interfere', () => {
  assert.equal(
    validateRelations(
      [entry('one', { featured: true }), entry('two', { featured: true })],
      [],
      [{ id: 'self' }],
    ).length,
    1,
  );
  assert.equal(
    validateRelations(
      [entry('one', { featured: true }), entry('two', { featured: true, draft: true })],
      [],
      [{ id: 'self' }],
    ).length,
    0,
  );
});
