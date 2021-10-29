const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const crypto = require("crypto");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const joi = require("joi");

dotenv.config();

// IMPORT STATUS_CODE_FILE
const { statusCode } = require("../constant/statusCode");

// IMPORT MESSAGE_FILE
const { messageBox } = require("../constant/message");

// IMPORT JOI_USER_SCHEMA
const { userAuthJoi } = require("../joiSchema/joiUserSchema");

// IMPORT USER SCHEMA_FILE
const User = require("../models/User");
const Otp = require("../models/Otp");

// USE NODE_MAILER FOR SENDING VERIFICATION MAILS
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// REGISTERSTION LOGIC
const registerController = async (req, res) => {
  try {
    // VALIDATE BODY DATA WITH JOI_USER_DATA
    const result = await userAuthJoi.validateAsync(req.body);

    // FOR SWITCHING EMAIL AND OTP VERIFICATION
    let check = 0;
    result.email ? (check = 2) : (check = 1);

    // FIND USER
    // const doesExist = await User.find({
    //   $or: [({ email: lowerCaseEmail }, { phone: result.phone })],
    // }).limit(1);

    // HASH PASSWORD USING BCRYPT
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    if (check === 1) {
      const doesExist = await User.findOne({
        phone: req.body.phone,
      });

      // IF USER NOT PRESENT IN DATABASE
      if (doesExist) {
        return res.status(statusCode.errorCode).json({
          msg: messageBox.userAlreadyReg,
        });
      }

      // GENERATE SIX DIGIT OTP
      const OTP = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
      });

      console.log(messageBox.otpSend);
      console.log(`Otp is ${OTP}`);

      // SAVE THE USER DATA
      const user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        employeId: req.body.employeId,
        depName: req.body.depName,
        country: req.body.country,
        phone: Number(req.body.phone),
        password: hashedPassword,
      });

      const finalUser = await user.save();

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
    } else if (check === 2) {
      const doesExist = await User.findOne({
        email: req.body.email.toLowerCase(),
      });

      // IF USER NOT PRESENT IN DATABASE
      if (doesExist) {
        return res.status(statusCode.errorCode).json({
          msg: messageBox.userAlreadyReg,
        });
      }

      // SAVE THE USER DATA
      const user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        employeId: req.body.employeId,
        depName: req.body.depName,
        country: req.body.country,
        email: req.body.email.toLowerCase(),
        password: hashedPassword,
        emailToken: crypto.randomBytes(64).toString("hex"),
      });

      const savedUser = await user.save();

      // SEND VERIFICATION MAIL
      var mailOption = {
        from: ' "Verify your email" <ajayjangid9299@gmail.com> ',
        to: savedUser.email,
        subject: "Welcome on eatos -verfiy your email",
        html: `<h2> ${savedUser.fname}! Thanks for registering on our site </h2>
        <h4>Please verify your mail to continue...</h4>
        <a href="http://${req.headers.host}/api/user/verify-email?token=${savedUser.emailToken}">Verify Your Email</a>`,
      };

      // FINAL PROCESS FOR MAIL SEND
      transporter.sendMail(mailOption, function (error, info) {
        if (error) {
          console.log(error);
        }
      });

      // RESPONSE TO USER
      res.status(statusCode.successCode).json({
        msg: messageBox.verificationEmailSend,
      });
    }
  } catch (error) {
    res.status(statusCode.errorCode).json({
      msg: error,
    });
  }
};

module.exports = { registerController };
