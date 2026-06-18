import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import {
  createProductValidator,
  getProductByIdValidator,
  getProductsQueryValidator,
  updateProductValidator,
} from "../middlewares/validators/product.validator.js";
import authenticateJWT from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const router = Router();

// public routes

router
  .get(
    "/",
    validateRequest(getProductsQueryValidator, "query"),
    productsController.getAll,
  )
  .get(
    "/:id",
    validateRequest(getProductByIdValidator, "params"),
    productsController.getById,
  )
  // protected routes
  .post(
    "/",
    authenticateJWT,
    authorize("admin"),
    validateRequest(createProductValidator, "body"),
    productsController.create,
  )
  .put(
    "/:id",
    authenticateJWT,
    authorize("admin"),
    validateRequest(updateProductValidator, "body"),
    productsController.update,
  )
  .delete(
    "/:id",
    authenticateJWT,
    authorize("admin"),
    productsController.delete,
  );

export default router;
