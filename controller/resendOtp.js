const otpGenerator = require("otp-generator");

// IMPORT STATUS_CODE_FILE
const { statusCode } = require("../constant/statusCode");

// IMPORT MESSAGE_FILE
const { messageBox } = require("../constant/message");

const Otp = require("../models/Otp");
const User = require("../models/User");

const { joiResentOtp } = require("../joiSchema/joiManProfileUpdate");

const resendOtp = async (req, res) => {
  try {
    const result = await joiResentOtp.validateAsync(req.body);

    const phoneNumber = req.body.phone;

    const userData = await User.findOne({ phone: phoneNumber });

    if (!userData) {
      return res.status(statusCode.errorCode).json({
        msg: messageBox.userNoteExisit,
      });
    }

    // GENERATE SIX DIGIT OTP
    const OTP = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    console.log(`Otp is ${OTP}`);

    // SAVE THE OTP
    const otp = new Otp({
      phone: Number(req.body.phone),
      otp: Number(OTP),
    });

    const finalOtp = await otp.save();

    // RESPONSE TO USER
    res.status(statusCode.successCode).json({
      msg: messageBox.otpSend,
    });
  } catch (error) {
    res.status(400).json({
      msg: error,
    });
  }
};

module.exports = { resendOtp };
