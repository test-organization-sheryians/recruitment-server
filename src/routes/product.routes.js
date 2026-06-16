import express from "express"; 
import authenticateJWT from "../middlewares/auth.middleware.js";
import productController from "../controllers/product.controller.js";
import { createProductValidator, updateProductValidator } from "../middlewares/validators/product.validator.js";
const router = express.Router();


router.post("/create",authenticateJWT,createProductValidator,productController.create);
router.get("/:id",productController.getProduct)
router.get("/", productController.getAllProducts);
router.patch("/update/:id",authenticateJWT,updateProductValidator,productController.updateProduct);
router.delete("/delete/:id",authenticateJWT,productController.deleteProduct);
export default router;