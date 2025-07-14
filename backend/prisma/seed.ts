import { PrismaClient } from '@prisma/client'
import { CATEGORIES, PRODUCTS } from '../../constants'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  // The order of deletion is important to respect foreign key constraints.
  await prisma.product.deleteMany()
  await prisma.subcategory.deleteMany()
  await prisma.category.deleteMany()

  console.log('Cleared previous data.')

  for (const category of CATEGORIES) {
    await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        subcategories: {
          create: category.subcategories.map((sub) => ({
            id: sub.id,
            name: sub.name,
          })),
        },
      },
    })
  }
  console.log(`Created ${CATEGORIES.length} categories with their subcategories.`)

  for (const product of PRODUCTS) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
        subcategoryId: product.subcategory,
      },
    })
  }
  console.log(`Created ${PRODUCTS.length} products.`)

  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 