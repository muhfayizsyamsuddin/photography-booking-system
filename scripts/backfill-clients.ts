import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const bookings = await prisma.booking.findMany({
    where: {
      clientId: null,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  for (const booking of bookings) {
    const client = await prisma.client.upsert({
      where: {
        phone: booking.phone,
      },
      update: {
        name: booking.clientName,
        email: booking.email || undefined,
      },
      create: {
        name: booking.clientName,
        phone: booking.phone,
        email: booking.email || null,
      },
    });

    await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        clientId: client.id,
      },
    });
  }

  console.log(`Backfilled ${bookings.length} bookings.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });