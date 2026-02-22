import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { detectVocabularyDuplicates, loadVocabularySeeds } from './vocabulary-import';

test('loadVocabularySeeds parses JSON payloads', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'vocab-seeds-'));
  const filePath = join(dir, 'seeds.json');
  const payload = [
    {
      word: 'sample',
      phonetic: '/ˈsæmpəl/',
      audio: 'tts:sample',
      definition: 'A small example.',
      example: 'This is a sample sentence.',
      level: 'A1',
      topic: 'Daily Life',
      partOfSpeech: 'noun'
    }
  ];

  await writeFile(filePath, JSON.stringify(payload), 'utf-8');

  const result = await loadVocabularySeeds(filePath);
  assert.equal(result.length, 1);
  assert.equal(result[0].word, 'sample');
});

test('loadVocabularySeeds parses CSV payloads with commas', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'vocab-seeds-'));
  const filePath = join(dir, 'seeds.csv');
  const csv = [
    'word,phonetic,audio,definition,example,level,topic,partOfSpeech',
    'sample,/ˈsæmpəl/,tts:sample,\"A small, representative example.\",\"This is a sample sentence.\",A1,Daily Life,noun'
  ].join('\n');

  await writeFile(filePath, csv, 'utf-8');

  const result = await loadVocabularySeeds(filePath);
  assert.equal(result.length, 1);
  assert.equal(result[0].definition, 'A small, representative example.');
});

test('detectVocabularyDuplicates returns duplicates by word and level', () => {
  const duplicates = detectVocabularyDuplicates([
    {
      word: 'sample',
      phonetic: '/ˈsæmpəl/',
      audio: 'tts:sample',
      definition: 'A small example.',
      example: 'This is a sample sentence.',
      level: 'A1',
      topic: 'Daily Life',
      partOfSpeech: 'noun'
    },
    {
      word: 'sample',
      phonetic: '/ˈsæmpəl/',
      audio: 'tts:sample',
      definition: 'Another definition.',
      example: 'Another example.',
      level: 'A1',
      topic: 'Daily Life',
      partOfSpeech: 'noun'
    }
  ]);

  assert.deepEqual(duplicates, ['sample (A1)']);
});
