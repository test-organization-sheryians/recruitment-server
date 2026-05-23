import express from "express";
import crudController from "../controllers/crud.controller.js";
import CrudValidator from "../middlewares/validators/crud.validator.js";

const router = express.Router();

router.post("/crud", CrudValidator.validateCreate, crudController.create);

router.get("/crud", crudController.read); 

router.patch("/crud/:id", CrudValidator.validateId, CrudValidator.validateUpdate, crudController.update);

router.delete("/crud/:id", CrudValidator.validateId, crudController.deleteData);

export default router;