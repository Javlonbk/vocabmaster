import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

import type { CefrLevel, VocabularySeed } from '@vocabmaster/shared';
import { vocabularySeedListSchema } from '@vocabmaster/shared';

import type { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../models/prisma';

type ImportResult = {
  inserted: number;
  skipped: number;
  total: number;
};

const frequencyByLevel: Record<CefrLevel, number> = {
  A1: 100,
  A2: 90,
  B1: 80,
  B2: 60,
  C1: 40,
  C2: 20
};

function parseCsvRow(row: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i += 1) {
    const char = row[i];
    const next = row[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values.map((value) => value.trim());
}

function parseCsv(text: string): VocabularySeed[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  const header = parseCsvRow(lines[0]);
  const requiredHeaders = ['word', 'phonetic', 'audio', 'definition', 'example', 'level', 'topic', 'partOfSpeech'];
  const missing = requiredHeaders.filter((key) => !header.includes(key));

  if (missing.length > 0) {
    throw new Error(`CSV missing required headers: ${missing.join(', ')}`);
  }

  const rows: VocabularySeed[] = [];
  for (const line of lines.slice(1)) {
    const values = parseCsvRow(line);
    const record: Record<string, string> = {};
    for (let i = 0; i < header.length; i += 1) {
      record[header[i]] = values[i] ?? '';
    }

    rows.push({
      word: record.word ?? '',
      phonetic: record.phonetic ?? '',
      audio: record.audio ?? '',
      definition: record.definition ?? '',
      example: record.example ?? '',
      level: record.level as VocabularySeed['level'],
      topic: record.topic as VocabularySeed['topic'],
      partOfSpeech: record.partOfSpeech as VocabularySeed['partOfSpeech']
    });
  }

  return rows;
}

export async function loadVocabularySeeds(filePath: string): Promise<VocabularySeed[]> {
  const raw = await readFile(filePath, 'utf-8');
  const normalized = raw.replace(/^\uFEFF/, '').replace(/\u0000/g, '');
  const extension = extname(filePath).toLowerCase();

  let seeds: VocabularySeed[];
  if (extension === '.json') {
    const trimmed = normalized.trim();
    if (trimmed.length === 0) {
      throw new Error(`Vocabulary seed file is empty: ${filePath}`);
    }
    seeds = JSON.parse(trimmed) as VocabularySeed[];
  } else if (extension === '.csv') {
    seeds = parseCsv(normalized);
  } else {
    throw new Error('Unsupported vocabulary seed format. Use .json or .csv.');
  }

  const parsed = vocabularySeedListSchema.parse(seeds);
  return parsed;
}

export function detectVocabularyDuplicates(seeds: VocabularySeed[]): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const seed of seeds) {
    const key = `${seed.word.toLowerCase()}::${seed.level}`;
    if (seen.has(key)) {
      duplicates.push(`${seed.word} (${seed.level})`);
    } else {
      seen.add(key);
    }
  }

  return duplicates;
}

export async function importVocabularySeeds(seeds: VocabularySeed[], prisma: PrismaClient = getPrismaClient()): Promise<ImportResult> {
  const duplicateKeys = detectVocabularyDuplicates(seeds);

  if (duplicateKeys.length > 0) {
    throw new Error(`Duplicate entries detected: ${duplicateKeys.join(', ')}`);
  }

  const result = await prisma.word.createMany({
    data: seeds.map((seed) => ({
      text: seed.word,
      meaning: seed.definition,
      phonetic: seed.phonetic,
      audio: seed.audio,
      example: seed.example,
      topic: seed.topic,
      partOfSpeech: seed.partOfSpeech,
      frequency: frequencyByLevel[seed.level] ?? 0,
      level: seed.level
    })),
    skipDuplicates: true
  });

  const inserted = result.count;
  const skipped = seeds.length - inserted;

  return {
    inserted,
    skipped,
    total: seeds.length
  };
}
