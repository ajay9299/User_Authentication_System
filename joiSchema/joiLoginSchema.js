const joi = require("joi");

const loginData = joi
  .object({
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .optional(),
    phone: joi.number().max(9999999999),
    password: joi.string().required(),
  })
  .or("email", "phone")
  .without("email", "phone")
  .without("phone", "email");

module.exports = { loginData };
