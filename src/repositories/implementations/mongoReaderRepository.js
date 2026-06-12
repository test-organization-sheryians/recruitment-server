import Reader from "../../models/Readers.model.js";
import IReaderRepository from "../contracts/IReaderRepository.js";
import { AppError } from "../../utils/errors.js";

class MongoReaderRepository extends IReaderRepository{

 async create(email){

   try{

     return await Reader.create({email});

   }catch(error){

     if(error.code === 11000){
       throw new AppError("Email already registered",409);
     }

     throw new AppError("Failed to save reader",500);
   }

 }

 async findAll(){

   return await Reader.find().select("email");

 }

 async findByEmail(email){

   return await Reader.findOne({email});

 }

}

export default MongoReaderRepository;