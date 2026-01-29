import express from 'express';
import ProductController from '../controllers/product.controller.js';

const router = express.Router();
const productController = new ProductController();

router.post("/cartData", productController.createdProduct);
router.get("/getData",productController.getAllProduct);
router.get("/getId",productController.getProductById);
router.patch("/update",productController.updateProduct);
router.delete("/delet",productController.deletProduct);


export default router;