import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing data
    await prisma.reservation.deleteMany();
    await prisma.space.deleteMany();

    const spaces = [
      {
        name: 'Studio A',
        description: 'Large recording studio with control room',
        hourlyRate: 100.00,
      },
      {
        name: 'Studio B',
        description: 'Medium-sized rehearsal space',
        hourlyRate: 75.00,
      },
      {
        name: 'Practice Room 1',
        description: 'Small practice room with piano',
        hourlyRate: 25.00,
      },
    ];

    for (const space of spaces) {
      await prisma.space.create({
        data: space,
      });
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
