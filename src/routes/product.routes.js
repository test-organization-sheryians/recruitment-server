import { Router } from "express";
import {  createProductValidator , updateProductValidator} from "../middlewares/validators/product.validator.js";
import productcontroller from "../controllers/product.controller.js";
import authenticateJWT from "../middlewares/auth.middleware.js";
const router = Router();
router.post("/create", createProductValidator, authenticateJWT , productcontroller.createProduct )
router.get("/getallproduct" , updateProductValidator , productcontroller.getAllproduct)
router.get("/getsingleproduct/:id" , productcontroller.getSingleproduct)
router.get("/updateproduct/:id" , productcontroller.updateProduct)
router.delete("/deleteproduct",productcontroller.deleteProdcut)
export default router