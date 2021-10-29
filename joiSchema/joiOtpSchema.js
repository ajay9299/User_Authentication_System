const joi = require("joi");

const userOtpJoi = joi.object({
  phone: joi.string().max(10).min(10).required(),
  otp: joi.string().min(6).max(6).required(),
});

module.exports = { userOtpJoi };
