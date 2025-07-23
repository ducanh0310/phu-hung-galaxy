import { PrismaClient, Prisma } from '@prisma/client';
import { CATEGORIES, PRODUCTS } from '../src/constants.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Using transaction to ensure all or nothing
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Clear existing data to make the seed script re-runnable
    await tx.product.deleteMany();
    await tx.subcategory.deleteMany();
    await tx.category.deleteMany();
    await tx.admin.deleteMany();

    console.log('Old data cleared.');

    // Seed Categories and their Subcategories
    for (const category of CATEGORIES) {
      await tx.category.create({
        data: {
          id: category.id,
          name: category.name,
          icon: category.icon,
          subcategories: {
            create: category.subcategories.map((sub: { id: string; name: string }) => ({
              id: sub.id,
              name: sub.name,
            })),
          },
        },
      });
    }
    console.log(`Seeded ${CATEGORIES.length} categories and their subcategories.`);

    // Seed Products
    for (const product of PRODUCTS) {
      await tx.product.create({
        data: {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          description: product.description,
          subcategoryId: product.subcategoryId,
        },
      });
    }
    console.log(`Seeded ${PRODUCTS.length} products.`);

    // Seed Admin User
    const adminUsername = 'admin';
    const password = 'password123'; // Use a more secure password in a real scenario
    const passwordHash = await bcrypt.hash(password, 10);
    await tx.admin.create({
      data: {
        username: adminUsername,
        passwordHash,
      },
    });
    console.log(`Seeded admin user with username: ${adminUsername}`);
  });

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
