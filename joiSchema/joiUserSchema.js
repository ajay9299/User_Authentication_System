const joi = require("joi");

const userAuthJoi = joi
  .object({
    fname: joi.string().alphanum().min(3).max(30).required(),
    lname: joi.string().alphanum().min(3).max(30).required(),
    employeId: joi.string().max(3).min(1).required(),
    depName: joi.string().required(),
    country: joi.string().alphanum().required(),
    email: joi.string().email(),
    phone: joi.string().max(10).min(10),
    password: joi.string().required(),
    role: joi.string().required(),
  })
  .or("email", "phone")
  .without("email", "phone")
  .without("phone", "email");

module.exports = { userAuthJoi };
