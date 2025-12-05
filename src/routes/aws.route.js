import { Router } from "express";
import { putObject } from "../config/getAwsS3PutObjectUrl.js";


const router = Router(); 

router.post('/presignedurl-s3' , putObject);

export default router ; 