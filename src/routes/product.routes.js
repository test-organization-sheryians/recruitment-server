import express from "express";
import productController from "../controllers/product.controller.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/", 
  authenticateJWT, 
  authorize("admin"), 
  productController.createProduct
);

router.get("/", authenticateJWT, productController.getProducts);

router.get("/category/:category", authenticateJWT, productController.getProductsByCategory);

router.get("/:id", authenticateJWT, productController.getProductById);

router.put(
  "/:id", 
  authenticateJWT, 
  authorize("admin"), 
  productController.updateProduct
);

router.delete("/:id", authenticateJWT, authorize("admin"), productController.deleteProduct);

export default router;