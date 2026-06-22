const ApiError = require("./ApiError");

function buildValidator(rules) {
  return rules.map((rule) => rule.builder()).flat();
}

async function runValidator(req, rules) {
  await Promise.all(rules.map((r) => r.run(req)));
  const { validationResult } = require("express-validator");
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new ApiError(422, "Validation failed", result.array());
  }
}

module.exports = { buildValidator, runValidator };