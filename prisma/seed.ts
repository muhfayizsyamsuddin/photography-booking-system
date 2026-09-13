import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: {
      email,
    },

    update: {
      name: "Photography Admin",
      passwordHash,
      role: "ADMIN",
    },

    create: {
      name: "Photography Admin",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.package.upsert({
    where: {
      slug: "graduation-basic",
    },
    update: {},
    create: {
      name: "Graduation Basic",
      slug: "graduation-basic",
      description: "Photography package for graduation sessions.",
      price: 500000,
      duration: "1 hour",
      includedServices: "1 photographer, edited photos, online delivery",
      isActive: true,
      displayOrder: 1,
    },
  });

  await prisma.package.upsert({
    where: {
      slug: "couple-session",
    },
    update: {},
    create: {
      name: "Couple Session",
      slug: "couple-session",
      description: "Photography session for couples.",
      price: 750000,
      duration: "1.5 hours",
      includedServices: "1 photographer, edited photos, online delivery",
      isActive: true,
      displayOrder: 2,
    },
  });

  console.log("Admin seeded successfully:");
  console.log({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });