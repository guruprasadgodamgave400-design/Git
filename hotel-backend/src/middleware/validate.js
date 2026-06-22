const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

function validate(rules) {
  return async (req, _res, next) => {
    try {
      await Promise.all(rules.map((r) => r.run(req)));
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return next(
          new ApiError(422, "Validation failed", result.array())
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = validate;