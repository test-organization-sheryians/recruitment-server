import { asyncHandler } from "../utils/asyncHandler.js";
import CompanyService from "../services/company.service.js";

class CompanyController {
  constructor() {
    this.companyService = new CompanyService();
  }

createCompany = asyncHandler(async (req, res) => {
    const company = await this.companyService.createCompany({
        ...req.body,
        createdBy: req.userId,
    });
    
    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  });

getAllCompanies = asyncHandler(async (req, res) => {
    const companies = await this.companyService.getAllCompanies();

    res.status(200).json({
      success: true,
      data: companies,
    });
  });

getCompanyById = asyncHandler(async (req, res) => {
    const company = await this.companyService.getCompanyById(req.params.id);

    res.status(200).json({
      success: true,
      data: company,
    });
  });  

updateCompany = asyncHandler(async (req, res) => {
    const company = await this.companyService.updateCompany(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  });

deleteCompany = asyncHandler(async (req, res) => {
    await this.companyService.deleteCompany(req.params.id);

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  });
}

export default new CompanyController();
