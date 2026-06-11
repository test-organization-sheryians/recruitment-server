import express from "express";
import productController from "../controllers/product.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(authenticateJWT);

router.post("/", authorize("admin"), productController.create);
router.get("/", productController.list);
router.get("/:id", productController.get);
router.put("/:id", authorize("admin"), productController.update);
router.delete("/:id", authorize("admin"), productController.delete);

export default router;