import { readFile } from 'node:fs/promises';

import type { ReadingPassageSeed } from '@vocabmaster/shared';
import { readingPassageSeedListSchema } from '@vocabmaster/shared';

import type { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../models/prisma';

type ImportResult = {
  inserted: number;
  skipped: number;
  total: number;
};

export async function loadReadingPassageSeeds(filePath: string): Promise<ReadingPassageSeed[]> {
  const raw = await readFile(filePath, 'utf-8');
  const normalized = raw.replace(/^\uFEFF/, '').replace(/\u0000/g, '');
  const trimmed = normalized.trim();
  if (trimmed.length === 0) {
    throw new Error(`Reading passage seed file is empty: ${filePath}`);
  }
  const parsed = JSON.parse(trimmed) as ReadingPassageSeed[];
  return readingPassageSeedListSchema.parse(parsed);
}

export async function importReadingPassages(
  seeds: ReadingPassageSeed[],
  prisma: PrismaClient = getPrismaClient()
): Promise<ImportResult> {
  const result = await prisma.readingPassage.createMany({
    data: seeds.map((seed) => ({
      ...(seed.id ? { id: seed.id } : {}),
      title: seed.title,
      content: seed.content,
      level: seed.level,
      topic: seed.topic,
      estimatedMinutes: seed.estimatedMinutes,
      vocabularyWords: seed.vocabularyWords
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
