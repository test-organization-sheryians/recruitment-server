import express from "express";
import productController from "../controllers/product.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticateJWT,
  productController.createProduct
);

router.get(
  "/",
  authenticateJWT,
  productController.getAllProducts
);

router.get(
  "/:id",
  authenticateJWT,
  productController.getProductById
);

router.put(
  "/:id",
  authenticateJWT,
  productController.updateProduct
);

router.delete(
  "/:id",
  authenticateJWT,
  productController.deleteProduct
);

export default router;