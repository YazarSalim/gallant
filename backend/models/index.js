import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected via Prisma!");
  } catch (err) {
    console.error("❌ Failed to connect to PostgreSQL:", err.message);
    process.exit(1);
  }
}

export default prisma;
