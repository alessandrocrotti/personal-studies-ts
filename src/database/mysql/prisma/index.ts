import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create
  const newUser = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
    },
  });
  console.log("newUser", newUser);

  // Read
  const users = await prisma.user.findMany();
  console.log("users", users);

  // Update
  const updatedUser = await prisma.user.update({
    where: { id: newUser.id },
    data: { name: "Jane Doe" },
  });
  console.log("updatedUser", updatedUser);

  // Delete
  await prisma.user.delete({ where: { id: newUser.id } });
}

main().finally(() => prisma.$disconnect());
