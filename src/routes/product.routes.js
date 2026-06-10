import express from "express";
import productController from "../controllers/product.controller.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../middlewares/validators/product.validator.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/create-product",
  validateRequest(createProductSchema),
  productController.createProduct
);

router.get(
  "/getAllproduct",
  productController.getAllProducts
);

router.get(
  "/search",
  productController.searchProducts
);

router.get(
  "/:id",
  productController.getProduct
);

router.put(
  "/:id",
  validateRequest(updateProductSchema),
  productController.updateProduct
);

router.delete(
  "/:id",
  productController.deleteProduct
);

export default router;