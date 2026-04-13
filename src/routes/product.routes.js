import express from "express"
const router = express.Router();
import productController from "../controllers/product.controller.js";


// Test route
router.get("/home", (req, res) => {
  res.send("Product Home Route");
});

// Create product
router.post("/", productController.createProduct);

// Get all products
router.get("/", productController.getAllProducts);

// Get single product
router.get("/:id", productController.getSingleProduct);

// Update product
router.put("/:id", productController.updateProduct);

// Delete product
router.delete("/:id", productController.deleteProduct);

export default router ; 
