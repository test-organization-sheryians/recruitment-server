import express  from 'express'


import ProductController from '../controllers/product.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const productRouter = express.Router();

const productController = new ProductController();

productRouter.post("/" ,authenticateJWT,productController.createProduct)

productRouter.get("/" , authenticateJWT, productController.getAllProducts)


productRouter.get("/:id",authenticateJWT, productController.getProduct)

productRouter.patch("/:id", authenticateJWT,productController.updateProduct)

productRouter.delete("/:id",authenticateJWT,productController.deleteProduct)


export default productRouter