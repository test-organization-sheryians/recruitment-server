import mongoCompanyRepository from "../repositories/implementations/mongoCompanyRepository.js";
import { AppError } from "../utils/errors.js";

class companyService {
  constructor() {
    this.companyrepository = new mongoCompanyRepository();
  }

  async createCompany(companyData, userId) {
    let existingCompany = await this.companyrepository.getAllCompanies();

    if (existingCompany) {
      throw new AppError("Company with this name already exists", 400);
    }

    if (userId) {
      companyData.createdBy = userId;
    }

    console.log("your company data in services is", companyData);

    return await this.companyrepository.createCompany(companyData);
  }

  async getAllCompanies() {
    return await this.companyrepository.getAllCompanies();
  }

  async getSingleCompany(id) {
    let company = await this.companyrepository.getSingleCompany(id);

    if (!company) {
      throw new AppError("company not found", 404);
    }

    return company;
  }

  async updateCompany(id, newData) {
    let company = await this.companyrepository.getSingleCompany(id);

    if (!company) {
      throw new AppError("company not found", 404);
    }

    if (newData.name && newData.name !== company.name) {
      let existingCompany = await companyModel.findOne({ name: newData.name });

      if (existingCompany) {
        throw new AppError("Company with this name already exists", 400);
      }
    }

    return await this.companyrepository.updateCompany(id, newData);
  }

  async deleteCompany(id) {
    let company = await this.companyrepository.getSingleCompany(id);

    if (!company) {
      throw new AppError("company not found", 404);
    }

    return await this.companyrepository.deleteCompany(id);
  }
}

export default companyService;