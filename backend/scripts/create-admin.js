import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function createHash(value) {
  return crypto
    .createHash("sha256")
    .update(String(value))
    .digest("hex");
}

async function main() {
  const user = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@crm.com",
      passwordHash: createHash("123456"),
      resetToken: null,
    },
  });

  console.log(user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });