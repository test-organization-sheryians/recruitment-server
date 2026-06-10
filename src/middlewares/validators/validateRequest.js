import { AppError } from "../../utils/errors.js";



const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const message = error.details.map(d => d.message).join(", ");
      return next(new AppError(message, 400));
    }

    if (property === "body" || property === "params") {
      req[property] = value;
    }

    
    if (property === "query") {
      req.validatedQuery = value;
    }

    next();
  };
};

export default validateRequest;

