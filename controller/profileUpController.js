const jwt = require("jsonwebtoken");
// IMPORT STATUS_CODE_FILE
const { statusCode } = require("../constant/statusCode");

// IMPORT MESSAGE_FILE
const { messageBox } = require("../constant/message");

// IMPORT USER SCHEMA_FILE
const User = require("../models/User");

// IMPORT JOI_GEN_PROFILE
const { genralProfile } = require("../joiSchema/joiGenralProfileUpdate");

const profileUpController = async (req, res) => {
  try {
    const resultData = await genralProfile.validateAsync(req.body);

    const token = await req.header("auth-token");
    const data = jwt.decode(token);
    const id = await data._id;

    // UPDATE THE NAME AND ADDRESS
    const userDashboardData = await User.updateOne({ _id: id }, req.body);
    res.status(statusCode.successCode).json({
      msg: messageBox.updateData,
    });
  } catch (error) {
    res.status(statusCode.errorCode).json({
      msg: error,
    });
  }
};

module.exports = { profileUpController };
