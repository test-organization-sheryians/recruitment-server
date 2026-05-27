import express from "express";
import productController from "../controllers/product.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { createProductValidator, updateProductValidator } from "../middlewares/validators/product.validator.js";

const router = express.Router();

// Create a new product (Admin only)
router.post(
    "/",
    // authenticateJWT,
    // authorize("admin"),
    createProductValidator,
    productController.createProduct
);

// Get all products (Public or authenticated based on your requirements, assuming public here)
router.get(
    "/",
    productController.getAllProducts
);

// Get products by category 
router.get(
    "/category/:categoryId",
    productController.getProductsByCategory
);

// Get a single product by ID
router.get(
    "/:id",
    productController.getProductById
);

// Update a product (Admin only)
router.put(
    "/:id",
    // authenticateJWT,
    // authorize("admin"),
    updateProductValidator,
    productController.updateProduct
);

// Delete a product (Admin only)
router.delete(
    "/:id",
    // authenticateJWT,
    // authorize("admin"),
    productController.deleteProduct
);

export default router;
