import { Queue } from "bullmq";
import bullmqRedis from "../config/bullmq-redis";

export const emailQueue = new Queue('email' , {
     connection:bullmqRedis,
     defaultJobOptions:{
         attempts:6,
         backoff:{
             type:'exponential', delay:5000
         },
         removeOnComplete:true , 
         removeOnFail:false
     }
})