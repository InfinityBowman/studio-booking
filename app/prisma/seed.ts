import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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
  ]

  for (const space of spaces) {
    await prisma.space.create({
      data: space,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
