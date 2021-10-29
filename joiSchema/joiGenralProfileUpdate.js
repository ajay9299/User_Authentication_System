const joi = require("joi");

const genralProfile = joi
  .object({
    fname: joi.string().alphanum().min(3).max(30),
    lname: joi.string().alphanum().min(3).max(30),
    employeId: joi.string().min(3).max(3),
    depName: joi.string(),
    country: joi.string().alphanum(),
  })
  .or("fname", "lname", "emploeId", "depName", "country");

module.exports = { genralProfile };
