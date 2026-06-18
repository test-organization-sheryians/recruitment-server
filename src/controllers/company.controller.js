import companyService from "../services/company.service.js";

class companyController {
  constructor() {
    this.companyservice = new companyService();
  }

  createCompany = async (req, res, next) => {
    try {
      let companyData = req.body;

      let userId = req.user?._id;

      console.log("your company data is -->", companyData);

      let result = await this.companyservice.createCompany(companyData, userId);

      return res.status(201).json({
        success: true,
        message: "company created successfully",
        data: result,
      });
    } catch (error) {
      console.log("error while creating company", error);
      next(error);
    }
  };

  getAllCompanies = async (req, res, next) => {
    try {
      let data = await this.companyservice.getAllCompanies();

      return res.status(200).json({
        success: true,
        message: "companies fetched successfully.",
        data,
      });
    } catch (error) {
      console.log("error while fetching companies", error);
      next(error);
    }
  };

  getSingleCompany = async (req, res, next) => {
    try {
      let id = req.params.id;

      let company = await this.companyservice.getSingleCompany(id);

      return res.status(200).json({
        success: true,
        message: "company fetched successfully",
        company,
      });
    } catch (error) {
      console.log("error while fetching company", error);
      next(error);
    }
  };

  updateCompany = async (req, res, next) => {
    try {
      let id = req.params.id;
      let newData = req.body;

      let updatedData = await this.companyservice.updateCompany(id, newData);

      return res.status(200).json({
        success: true,
        message: "company updated successfully",
        updatedData,
      });
    } catch (error) {
      console.log("error while updating company", error);
      next(error);
    }
  };

  deleteCompany = async (req, res, next) => {
    try {
      let id = req.params.id;

      let deletedCompany = await this.companyservice.deleteCompany(id);

      return res.status(200).json({
        success: true,
        message: "company deleted successfully",
        deletedCompany,
      });
    } catch (error) {
      console.log("error while deleting company", error);
      next(error);
    }
  };
}

export default new companyController();