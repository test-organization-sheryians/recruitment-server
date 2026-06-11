import MongoCompanyRepository from "../repositories/implementations/mongoCompanyRepository.js";
import { AppError } from "../utils/errors.js";

class CompanyService {
    constructor(){
        this.companyRepository = new MongoCompanyRepository();
    }

    async createCompany(data){
     if (!data.name?.trim()) {
      throw new AppError("Company name is required", 400);
    }
      
    if (!data.email?.trim()) {
      throw new AppError("Company email is required", 400);
    }  
    
    return await this.companyRepository.createCompany(data);
    }

    async getAllCompanies() {
    return await this.companyRepository.getAllCompanies();
    }

    async getCompanyById(Id) {
    const company = await this.companyRepository.getCompanyById(Id);
    

    if (!company) {
      throw new AppError("Company not found", 404);
    }
    
    return company;
}   

    async updateCompany(Id, data) {
    const company = await this.companyRepository.updateCompany(
      Id,
      data
    );

    if (!company) {
      throw new AppError("Company not found", 404);
    }

    return company;
    }
    
    async deleteCompany(Id) {
    const company = await this.companyRepository.deleteCompany(Id);

    if (!company) {
      throw new AppError("Company not found", 404);
    }

    return company; 
  }
}

export default CompanyService;

