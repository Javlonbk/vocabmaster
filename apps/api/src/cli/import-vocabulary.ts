import { resolve } from 'node:path';

import { importVocabularySeeds, loadVocabularySeeds } from '../utils/vocabulary-import';

async function main(): Promise<void> {
  const input = process.argv[2];
  if (!input) {
    throw new Error('Usage: tsx src/cli/import-vocabulary.ts <path-to-vocabulary.json|csv>');
  }

  const filePath = resolve(process.cwd(), input);
  const seeds = await loadVocabularySeeds(filePath);
  const result = await importVocabularySeeds(seeds);

  console.log(`Vocabulary import complete. Inserted ${result.inserted}, skipped ${result.skipped}.`);
}

main().catch((error: unknown) => {
  console.error('Vocabulary import failed.', error);
  process.exitCode = 1;
});
