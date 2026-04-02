import express from "express";
import productController from "../controllers/product.controller.js";
import { createProductValidator, updateProductValidator } from "../middlewares/validators/product.validator.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
const router=express.Router()
router.post("/create",createProductValidator,authenticateJWT,productController.createProduct)
router.get("/getAllProducts",productController.getAllProducts)
router.get("/getSingleProduct/:id",productController.getSingleProduct)
router.put("/updateProduct/:id",updateProductValidator,productController.updateProduct)
router.delete("/deleteProduct/:id",productController.deleteProduct)
export default router