const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const data = require("../data.json");

async function addProductData() {
  try {
    const hasProducts = await prisma.product.count();
    if (!hasProducts) {
      const createManyResult = await prisma.product.createMany({
        data,
      });
      console.log(
        `${createManyResult.count} records in product was successfully added`,
      );
    }
  } catch (error) {
    console.error({ error });
  }
}

addProductData();

module.exports = {
  prisma,
};
