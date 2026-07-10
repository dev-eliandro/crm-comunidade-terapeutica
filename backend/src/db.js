import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export function createHash(value) {
  const hash = crypto
    .createHash("sha256")
    .update(String(value), "utf8")
    .digest("hex");


  return hash;
}

export async function initDb() {
  console.log("PostgreSQL conectado.");
  await seedDefaultUser();
}

export async function seedDefaultUser() {
  const existing = await prisma.user.findUnique({
    where: {
      username: "admin",
    },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@crm.local",
        passwordHash: createHash("123456"),
      },
    });

    
  }
}

export async function findUserByIdentifier(identifier) {
  return prisma.user.findFirst({
    where: {
      OR: [
        { username: identifier },
        { email: identifier },
      ],
    },
  });
}

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUserByResetToken(token) {
  return prisma.user.findFirst({
    where: {
      resetToken: token,
    },
  });
}

export async function createUser({
  username,
  email,
  passwordHash,
}) {
  return prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
  });
}

export async function updateUserPassword(id, passwordHash) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      passwordHash,
    },
  });
}

export async function setResetToken(email, token) {
  return prisma.user.update({
    where: {
      email,
    },
    data: {
      resetToken: token,
    },
  });
}

export async function clearResetToken(id) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      resetToken: null,
    },
  });
}

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}