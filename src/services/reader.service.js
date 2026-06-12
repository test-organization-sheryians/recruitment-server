import MongoReaderRepository from "../repositories/implementations/mongoReaderRepository.js";

class ReaderService{

 constructor(){

   this.readerRepo = new MongoReaderRepository();

 }

 async registerReader(email){

   const existing = await this.readerRepo.findByEmail(email);

   if(existing){
     throw new Error("Email already registered");
   }

   return await this.readerRepo.create(email);

 }

 async getReaders(){

   return await this.readerRepo.findAll();

 }

}

export default ReaderService;