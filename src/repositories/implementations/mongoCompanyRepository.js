import Company from "../../models/company.model.js";
import { AppError } from "../../utils/errors.js";
import ICompanyRepository from "../contracts/ICompanyRepository.js";


class MongoCompanyRepository extends ICompanyRepository {
    async createCompany(data){
        try {
            return await Company.create(data);
        } catch (error) {
            throw new AppError("Unable to create company", 500);
        }
    }

    async getAllCompanies(){
        try {
            return await Company.find()
            .populate("createdBy","name email");
        } catch (error) {
            throw new AppError("unable to fetch company", 500);
            
        }
    }

     async getCompanyById(Id){
        try {
            return await Company.findById(Id)
            .populate("createdBy","name email");
        } catch (error) {
            throw new AppError("unable to fetch company", 500);
            
        }
    }
     async  updateCompany(Id, data){
        try {
            return await Company.findByIdAndUpdate(
                Id, 
                data,
                {
                    new: true,
                    runValidators: true,
                }
            );
        } catch (error) {
            throw new AppError("unable to fetch company", 500);
            
        }
    }
    async deleteCompany(Id) {
    try {
      return await Company.findByIdAndDelete(Id);
    } catch (error) {
      throw new AppError("Unable to delete company", 500);
    }
  }
}

export default MongoCompanyRepository;