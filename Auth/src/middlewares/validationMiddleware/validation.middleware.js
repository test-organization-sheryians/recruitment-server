import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

const validate = (schema) =>
  asyncHandler(async (req, res, next) => {
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
      throw new ApiError(
        400,
        "Validation failed",
        result.error.errors
      );
    }

    req.validatedData = result.data;

    next();
  });

export default validate;