import { PrismaClient } from '@prisma/client';
import { problems } from './data/problems';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createProblem(p: (typeof problems)[0]) {
  await prisma.problem.create({
    data: {
      slug: p.slug,
      difficulty: p.difficulty,
      isPublished: true,
      translations: { create: p.translations },
      testCases: { create: p.testCases },
    },
  });
}

async function main() {
  for (const p of problems) {
    await createProblem(p);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
