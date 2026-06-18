import express from "express";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();
const productController = new ProductController();

router.post("/", productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;