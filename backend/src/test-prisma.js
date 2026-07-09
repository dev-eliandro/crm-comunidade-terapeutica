import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();

    console.table(users);
}

main()
.catch(console.error)
.finally(async () => {
    await prisma.$disconnect();
});