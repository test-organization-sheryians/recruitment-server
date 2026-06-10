import express from "express";
import productController from "../controllers/product.controller.js";

const router = express.Router();

router.post("/createproduct", productController.createProduct);

router.get("/getallproduct", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

export default router;
