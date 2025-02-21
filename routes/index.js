const express = require("express");
const { UserContorller, ProductController } = require("../controllers/");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

router.post("/register", UserContorller.register);
router.post("/login", UserContorller.login);
router.get("/current", authenticateToken, UserContorller.current);
router.get("/users/:id", authenticateToken, UserContorller.getUserById);
router.put("/users/:id", authenticateToken, UserContorller.updateUser);

router.get(
  "/products/:id",
  authenticateToken,
  ProductController.getProductById,
);
router.get(
  "/category/:category",
  authenticateToken,
  ProductController.getProductsByCategory,
);
router.get("/products", authenticateToken, ProductController.getAllProducts);

module.exports = router;
