import express from "express";
import ProductController from "../controllers/product.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
const productController = new ProductController();

router.post("/create", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/single-product/:id", productController.getProductById);
router.patch("/update/:id",productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

export default router;
