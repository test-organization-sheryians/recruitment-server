import ReaderService from "../services/reader.service.js";

class ReaderController{

 constructor(){

   this.readerService = new ReaderService();

 }

 registerReader = async(req,res,next)=>{

   try{

     const {email} = req.body;

     const data = await this.readerService.registerReader(email);

     res.status(201).json({

       success:true,
       data,
       message:"Reader registered successfully"

     });

   }catch(error){

     next(error);

   }

 }

 getReaders = async(req,res,next)=>{

   try{

     const data = await this.readerService.getReaders();

     res.json({

       success:true,
       data

     });

   }catch(error){

     next(error);

   }

 }

}

export default ReaderController;