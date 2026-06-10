import express from "express";
import ProductController from "../controllers/productController.js"
import {
	productCreateValidator,
	productUpdateValidator,
} from "../middlewares/validators/product.validator.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
const productController = new ProductController();




router.post(
	"/",
	validateRequest(productCreateValidator),
	productController.createProduct,
);


router.get("/", productController.getAllProducts);


router.get("/:id", productController.getProductById);


router.patch(
	"/:id",
	validateRequest(productUpdateValidator),
	productController.updateProduct,
);

router.delete("/:id", productController.deleteProduct);

export default router;
