import express from "express";
import {createProduct,updateProduct,deleteProduct} from "../controllers/Product.controller.js"


export const router = express.Router();


router.post("/create",createProduct);
router.put("/update/:id",updateProduct);
router.delete("/delete/:id",deleteProduct);


export default router;
