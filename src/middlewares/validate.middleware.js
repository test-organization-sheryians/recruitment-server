export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });

      next();
    } catch (error) {
      const errors = error.errors?.map((err) => ({
        field: err.path.join("."),
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }
  };
};