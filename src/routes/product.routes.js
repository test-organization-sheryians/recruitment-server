import express from "express"
import authenticateJWT from "../middlewares/auth.middleware.js";
import productController from "../controllers/product.controller.js";
import { productValidator, updateProductValidator } from "../middlewares/validators/product.validator.js";

const router = express.Router();

router.post("/create", authenticateJWT, productValidator, productController.createProduct);
router.get("/getAllProducts", productController.getAllProduct);
router.get("/:productId", productController.getProductById);
router.patch("/update/:productId", authenticateJWT, updateProductValidator, productController.updateProduct);
router.delete("/delete/:productId", authenticateJWT, productController.deleteProduct);


export default router