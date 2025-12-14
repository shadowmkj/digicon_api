import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../prisma/generated/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "digicon_db",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    connectionLimit: 5
})

const prisma = new PrismaClient({ adapter })

async function main() {
  // Seed users
  const users = await prisma.user.createMany({
    data: [
      { name: "John Doe", email: "john.doe@example.com" },
      { name: "Jane Smith", email: "jane.smith@example.com" },
      { name: "Alice Johnson", email: "alice.johnson@example.com" },
    ],
  });

  await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@test.com",
      password: await bcrypt.hash("password", 10),
      role: "ADMIN",
    },
  });
  console.log(`${users.count} users created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
