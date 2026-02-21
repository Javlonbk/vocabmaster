import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const wordCount = await prisma.word.count();
  console.log(`Seed scaffold executed. Existing words in database: ${wordCount}.`);
}

main()
  .catch((error: unknown) => {
    console.error('Seed execution failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
