const joi = require("joi");

const joiPhone = joi.object({
  phone: joi.string().min(10).max(10).required(),
  password: joi.string().required(),
});

const joiResentOtp = joi.object({
  phone: joi.string().min(10).max(10).required(),
});

const joiEmail = joi.object({
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: joi.string().required(),
});

const joiPassword = joi.object({
  passwordOld: joi.string().required(),
  passwordNew: joi.string().required(),
});

module.exports = { joiPhone, joiEmail, joiPassword, joiResentOtp };
