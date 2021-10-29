const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");

dotenv.config();

// IMPORT MESSAGE_FILE
const { messageBox } = require("../constant/message");

// IMPORT USER_SCHEMA
const User = require("../models/User");

// IMPORT OTP_SCHEMA
const Otp = require("../models/Otp");

// IMPORT JOI_PHONE_FILE
const { joiPhone } = require("../joiSchema/joiManProfileUpdate");

// IMPORT STATUS_CODE_FILE
const { statusCode } = require("../constant/statusCode");

const phoneUpdateController = async (req, res) => {
  try {
    // VALIDATE PHONE NUMBER
    const validData = await joiPhone.validateAsync(req.body);

    const token = await req.header("auth-token");
    const data = jwt.decode(token);
    const id = data._id;

    const oldUser = await User.findOne({ phone: req.body.phone });

    if (oldUser) {
      return res.status(statusCode.errorCode).json({
        msg: "Phone number already present",
      });
    }

    // CHECK_PASSWORD
    const mainUser = await User.findOne({ _id: id });

    const validPass = await bcrypt.compare(
      req.body.password,
      mainUser.password
    );

    if (!validPass) {
      return res.status(statusCode.errorCode).json({
        msg: messageBox.invalidPass,
      });
    }

    const userPhone = await User.findByIdAndUpdate(
      { _id: id },
      { $set: { phone: validData.phone, isVerified: false } }
    );

    // GENERATE SIX DIGIT OTP
    const OTP = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    // SAVE THE OTP
    const otp = new Otp({
      phone: req.body.phone,
      otp: OTP,
    });

    await otp.save();

    console.log(messageBox.otpSend);
    console.log(`Otp is ${OTP}`);

    res.status(statusCode.successCode).json({
      msg: messageBox.otpSend,
    });
  } catch (error) {
    res.status(statusCode.errorCode).json({
      msg: error,
    });
  }
};

module.exports = { phoneUpdateController };
