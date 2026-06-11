import companyModel from "../../models/company.model.js";
import { AppError } from "../../utils/errors.js";
import ICompanyRepository from "../contracts/ICompanyRepository.js";

class mongoCompanyRepository extends ICompanyRepository {
  async createCompany(companyData) {
    try {
      let company = new companyModel(companyData);
      let savedCompany = await company.save();
      return savedCompany;
    } catch (error) {
      console.log("error while creating company", error);
      throw new AppError(`error while creating company : ${error.message}`, 500, error);
    }
  }

  async getAllCompanies() {
    try {
      let companies = await companyModel.find().populate("createdBy", "name email");
      return companies;
    } catch (error) {
      console.log("error while fetching companies", error);
      throw new AppError(`error while fetching companies : ${error.message}`, 500, error);
    }
  }

  async getSingleCompany(id) {
    try {
      let singleCompany = await companyModel
        .findById(id)
        .populate("createdBy", "name email");

      return singleCompany;
    } catch (error) {
      console.log("error while fetching company", error);
      throw new AppError(`error while fetching company : ${error.message}`, 500, error);
    }
  }

  async updateCompany(id, newData) {
    try {
      let updatedCompany = await companyModel.findByIdAndUpdate(id, newData, {
        new: true,
        runValidators: true,
      });

      return updatedCompany;
    } catch (error) {
      console.log("error while updating company", error);
      throw new AppError(`error while updating company : ${error.message}`, 500, error);
    }
  }

  async deleteCompany(id) {
    try {
      let deletedCompany = await companyModel.findByIdAndDelete(id);
      return deletedCompany;
    } catch (error) {
      console.log("error while deleting company", error);
      throw new AppError(`error while deleting company : ${error.message}`, 500, error);
    }
  }
}

export default mongoCompanyRepository;