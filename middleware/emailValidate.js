const bcrypt = require("bcrypt");

const User = require("../models/User");

// IMPORT STATUS_CODE_FILE
const { statusCode } = require("../constant/statusCode");

// IMPORT MESSAGE_FILE
const { messageBox } = require("../constant/message");

const addEmailVerifiy = async (req, res) => {
  try {
    const token = req.query.token;
    const userCheck = await User.findOne({ emailToken: token });
    if (userCheck) {
      userCheck.emailToken = null;
      userCheck.isVerified = true;
      await userCheck.save();
      res.status(statusCode.successCode).json({
        msg: messageBox.successEmail,
      });
    } else {
      res.status(statusCode.errorCode).json({
        msg: messageBox.failEmail,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addEmailVerifiy };
