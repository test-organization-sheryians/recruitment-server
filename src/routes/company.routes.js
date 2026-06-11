import express from "express";
import companyController from "../controllers/company.controller.js";
import {
  createCompanyValidator,
  updateCompanyValidator,
} from "../middlewares/validators/company.validator.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/create",
  createCompanyValidator,
  authenticateJWT,
  companyController.createCompany
);

router.get("/getAllCompanies", companyController.getAllCompanies);

router.get("/getSingleCompany/:id", companyController.getSingleCompany);

router.put(
  "/updateCompany/:id",
  updateCompanyValidator,
  authenticateJWT,
  companyController.updateCompany
);

router.delete(
  "/deleteCompany/:id",
  authenticateJWT,
  companyController.deleteCompany
);

export default router;