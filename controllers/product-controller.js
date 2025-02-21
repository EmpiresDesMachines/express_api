const { prisma } = require("../prisma/prisma-client");

const ProductController = {
  getProductById: async (req, res) => {
    console.log("getProductById");
    const { id } = req.params;
    //const productId = req.product.userId;
    try {
      if (!/^[a-fA-F0-9]{24}$/.test(id)) {
        return res.status(404).json({ error: "Product not found." });
      }
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }

      res.send({ product });
    } catch (error) {
      console.error("Get ProductById Error", error);
      res.status(500).json({ error: "Internal server errror." });
    }
  },
  getProductsByCategory: async (req, res) => {
    const { category } = req.params;
    try {
      const categoryProducts = await prisma.product.findMany({
        where: { category },
      });
      if (!categoryProducts.length) {
        return res.status(404).json({ error: "Category not found." });
      }
      res.json(categoryProducts);
    } catch (error) {
      console.error("Get ProductByCategory Error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const products = await prisma.product.findMany({
        orderBy: {
          intro: "desc",
        },
      });

      res.json(products);
    } catch (err) {
      console.error("Get All Products Error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = ProductController;
