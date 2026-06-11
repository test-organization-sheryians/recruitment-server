import express from "express";
import companyController from "../controllers/company.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create Company
router.post(
  "/create",
  authenticateJWT,
  companyController.createCompany
);

// Get All Companies
router.get(
  "/get-all",
  authenticateJWT,
  companyController.getAllCompanies
);

// Get Company By Id
router.get(
  "/get/:id",
  authenticateJWT,
  companyController.getCompanyById
);

// Update Company
router.put(
  "/update/:id",
  authenticateJWT,
  companyController.updateCompany
);

// Delete Company
router.delete(
  "/delete/:id",
  authenticateJWT,
  companyController.deleteCompany
);

export default router;