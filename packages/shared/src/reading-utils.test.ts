import assert from 'node:assert/strict';
import test from 'node:test';

import { clampPopupPosition, extractVocabWords, parseVocabMarkup, stripVocabMarkup } from './reading-utils';

test('parseVocabMarkup splits vocab segments', () => {
  const input = 'A <vocab>book</vocab> and <vocab>friend</vocab>.';
  const segments = parseVocabMarkup(input);

  assert.deepEqual(segments, [
    { text: 'A ', isVocab: false },
    { text: 'book', isVocab: true },
    { text: ' and ', isVocab: false },
    { text: 'friend', isVocab: true },
    { text: '.', isVocab: false }
  ]);
});

test('stripVocabMarkup removes tags', () => {
  const input = 'Read a <vocab>book</vocab>.';
  assert.equal(stripVocabMarkup(input), 'Read a book.');
});

test('extractVocabWords returns tag words', () => {
  const input = 'A <vocab>book</vocab> and <vocab>friend</vocab>.';
  assert.deepEqual(extractVocabWords(input), ['book', 'friend']);
});

test('clampPopupPosition keeps popup within bounds', () => {
  const placement = clampPopupPosition({
    anchorX: 10,
    anchorY: 10,
    popupWidth: 200,
    popupHeight: 120,
    screenWidth: 320,
    screenHeight: 640,
    margin: 12
  });

  assert.ok(placement.left >= 12);
  assert.ok(placement.top >= 12);
});
