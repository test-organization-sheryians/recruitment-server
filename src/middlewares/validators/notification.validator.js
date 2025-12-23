import Joi from "joi"
import { AppError } from "../../utils/errors.js"

//create notification schema
export const createNotificationSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Title must be required",
    "string.min": "Title must be at least 3 letters",
    "string.max": "Title must be maximum 100 letters",
  }),
  message: Joi.string().trim().min(5).max(500).required().messages({
    "string.empty": "Title must be required",
    "string.min": "Title must be at least 5 letters",
    "string.max": "Title must be maximum 500 letters",
  }),
  type: Joi.string().valid("JOB_ALERT", "APPLICATION", "INTERVIEW", "SYSTEM").optional().messages({
    "any.only": "Invalid notification type",
  }),
  isRead:Joi.boolean().optional(),
})


//update notification schema 
export const updateNotificationSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).optional().messages({
    "string.min": "Title must be at least 3 letters",
    "string.max": "Title must be maximum 100 letters",
  }),
  message: Joi.string().trim().min(5).max(500).optional().messages({
    "string.empty": "Title must be required",
    "string.min": "Title must be at least 5 letters",
    "string.max": "Title must be maximum 500 letters",
  }),
  type: Joi.string().valid("JOB_ALERT", "APPLICATION", "INTERVIEW", "SYSTEM").optional().messages({
    "any.only": "Invalid notification type",
  }),
  isRead:Joi.boolean().optional(),
}).min(1);

//validate middleware
const validate = (schema)=>(req,_res,next)=>{
    const {error} = schema.validate(req.body,{
        abortEarly:false,
        stripUnknown:true
    });

    if(error){
        const message = error.details.map((d) => d.message).join(", ");
        return next(new AppError(message, 400));
    }

    next();
}

export const createNotificationValidator = validate(createNotificationSchema);
export const updateNotificationValidator = validate(updateNotificationSchema);




