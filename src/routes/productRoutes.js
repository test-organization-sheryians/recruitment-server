import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import authenticateJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProduct);

// Protected routes
router.post("/", authenticateJWT, createProduct);
router.put("/:id", authenticateJWT, updateProduct);
router.delete("/:id", authenticateJWT, deleteProduct);

export default router;
