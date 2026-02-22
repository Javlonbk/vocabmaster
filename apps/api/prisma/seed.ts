import { resolve } from 'node:path';

import { PrismaClient } from '@prisma/client';

import { importVocabularySeeds, loadVocabularySeeds } from '../src/utils/vocabulary-import';
import { importReadingPassages, loadReadingPassageSeeds } from '../src/utils/reading-import';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const seedPath = resolve(process.cwd(), 'prisma', 'vocabulary-seeds.json');
  const seeds = await loadVocabularySeeds(seedPath);
  const result = await importVocabularySeeds(seeds, prisma);
  const wordCount = await prisma.word.count();

  const readingSeedPath = resolve(process.cwd(), 'prisma', 'reading-passages.json');
  const readingSeeds = await loadReadingPassageSeeds(readingSeedPath);
  const readingResult = await importReadingPassages(readingSeeds, prisma);
  const passageCount = await prisma.readingPassage.count();

  console.log(`Vocabulary seed import complete. Inserted ${result.inserted}, skipped ${result.skipped}. Total words: ${wordCount}.`);
  console.log(`Reading passage import complete. Inserted ${readingResult.inserted}, skipped ${readingResult.skipped}. Total passages: ${passageCount}.`);
}

main()
  .catch((error: unknown) => {
    console.error('Seed execution failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
