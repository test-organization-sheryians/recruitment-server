
import express from "express";

import ProductController from "../controllers/product.controller.js";

import { authenticateJWT } from "../middlewares/auth.middleware.js";

import {
  createProductValidator,
  updateProductValidator,
} from "../middlewares/validators/product.validator.js";

const router = express.Router();

const productController = new ProductController();

router.post(
  "/",

  createProductValidator,
  productController.createProduct
);

router.get(
  "/",
  
  productController.getAllProducts
);

router.get(
  "/:productId",

  productController.getProductById
);

router.patch(
  "/:productId",
 
  updateProductValidator,
  productController.updateProduct
);

router.delete(
  "/:productId",

  productController.deleteProduct
);

export default router;