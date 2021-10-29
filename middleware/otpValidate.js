const Otp = require("../models/Otp");

// IMPORT STATUS_CODE_FILE
const { statusCode } = require("../constant/statusCode");

// IMPORT OTP_JOI_SCHEMA
const { userOtpJoi } = require("../joiSchema/joiOtpSchema");

// IMPORT MESSAGE_FILE
const { messageBox } = require("../constant/message");

const User = require("../models/User");

const addOtpVerifiy = async (req, res) => {
  try {
    const result = await userOtpJoi.validateAsync(req.body);

    const number = Number(req.body.phone);
    const OTP = Number(req.body.otp);

    // FIND USER BY NUMBER
    const userCheck = await User.findOne({ phone: number });
    if (!userCheck) {
      return res.status(statusCode.errorCode).json({
        msg: messageBox.userNoteExisit,
      });
    }

    const otpHolder = await Otp.findOne({ phone: number });

    if (!otpHolder) {
      return res.status(statusCode.errorCode).json({
        msg: "Otp expired",
      });
    }

    const validOtp = otpHolder.otp;

    if (validOtp === OTP) {
      await User.updateOne({ phone: number }, { isVerified: true });
      return res.status(statusCode.successCode).json({
        msg: messageBox.successOtp,
      });
    }
    return res.status(400).json({
      msg: "Invalid Otp",
    });
  } catch (error) {
    res.status(statusCode.errorCode).json({
      msg: error,
    });
  }
};

module.exports = { addOtpVerifiy };
