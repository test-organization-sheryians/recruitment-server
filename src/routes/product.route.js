import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import authenticateJWT from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../middlewares/validators/product.validator.js";

const router = Router();
const productController = new ProductController();

router.use(authenticateJWT);

router.post(
  "/create",
  validateRequest(createProductSchema),
  productController.createProduct,
);

router.get("/all/:userId", productController.getProductsByUser);

router.patch(
  "/update/:id",
  validateRequest(updateProductSchema),
  productController.updateProduct,
);

router.delete("/delete/:id", productController.deleteProduct);

export default router;
