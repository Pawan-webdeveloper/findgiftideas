import { test } from 'node:test';
import assert from 'node:assert/strict';

import { CURATED_CARDS, getCardBySlug, getCardPath } from './data';

test('finds a card by its SEO slug', () => {
  const card = getCardBySlug('thoughtful-gifts-for-mom');
  assert.ok(card);
  assert.equal(card?.id, 'moms');
});

test('builds a readable detail page path', () => {
  const card = CURATED_CARDS.find((item) => item.id === 'moms');
  assert.ok(card);
  assert.equal(getCardPath(card!), '/gift/thoughtful-gifts-for-mom');
});
