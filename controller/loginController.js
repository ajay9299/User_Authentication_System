const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

// IMPORT STATUS_CODE_FILE
const { statusCode } = require("../constant/statusCode");

// IMPORT MESSAGE_FILE
const { messageBox } = require("../constant/message");

// IMPORT USER SCHEMA_FILE
const User = require("../models/User");
const { loginData } = require("../joiSchema/joiLoginSchema");

const loginController = async (req, res) => {
  try {
    // VALIDATE BODY DATA WITH JOI_LOGIN_DATA
    const result = await loginData.validateAsync(req.body);

    // FOR SWITCHING EMAIL AND OTP VERIFICATION
    let check = 0;
    result.email ? (check = 2) : (check = 1);

    // FIND USER
    // const doesExist = await User.findOne({
    //   $or: [{ email: req.body.email }, { phone: result.phone }],
    // });

    if (check === 1) {
      // FIND USER
      const doesExist = await User.findOne({ phone: result.phone });

      // IF USER NOT PRESENT IN DATABASE
      if (!doesExist) {
        return res.status(statusCode.errorCode).json({
          msg: messageBox.userNoteExisit,
        });
      }

      // PASSWORD CHECK
      const validPass = await bcrypt.compare(
        req.body.password,
        doesExist.password
      );

      if (!validPass) {
        return res.status(statusCode.errorCode).json({
          msg: messageBox.invalidPass,
        });
      }

      const verifyStatus = doesExist.isVerified;

      if (!verifyStatus) {
        return res.status(statusCode.errorCode).json({
          msg: messageBox.verifyAccount,
        });
      }

      // JWT TOKEN CREATE BASED ON ID
      const token = jwt.sign({ _id: doesExist._id }, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
      });

      res.status(statusCode.successCode).json({
        msg: token,
      });
    } else if (check === 2) {
      // FIND USER
      const doesExist = await User.findOne({
        email: req.body.email.toLowerCase(),
      });

      // IF USER NOT PRESENT IN DATABASE
      if (!doesExist) {
        return res.status(statusCode.errorCode).json({
          msg: messageBox.userNoteExisit,
        });
      }

      // PASSWORD CHECK
      const validPass = await bcrypt.compare(
        req.body.password,
        doesExist.password
      );

      if (!validPass) {
        return res.status(statusCode.errorCode).json({
          msg: messageBox.invalidPass,
        });
      }

      const verifyStatus = doesExist.isVerified;

      if (!verifyStatus) {
        return res.status(statusCode.errorCode).json({
          msg: messageBox.verifyAccount,
        });
      }

      // JWT TOKEN CREATE BASED ON ID
      const token = jwt.sign({ _id: doesExist._id }, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
      });

      res.status(statusCode.successCode).json({
        msg: token,
      });
    }
  } catch (error) {
    res.status(statusCode.errorCode).json({
      msg: error,
    });
  }
};

module.exports = { loginController };
