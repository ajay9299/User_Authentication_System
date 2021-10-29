const crypto = require("crypto");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

dotenv.config();

// IMPORT USER_SCHEMA
const User = require("../models/User");

// IMPORT MESSAGE_FILE
const { messageBox } = require("../constant/message");

// IMPORT STATUS_CODE_FILE
const { statusCode } = require("../constant/statusCode");

// IMPORT JOI_EMAIL_FILE
const { joiEmail } = require("../joiSchema/joiManProfileUpdate");

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

const emailUpdateController = async (req, res) => {
  try {
    // VALIDATE EMAIL
    const validData = await joiEmail.validateAsync(req.body);

    const token = await req.header("auth-token");
    const data = jwt.decode(token);
    const id = data._id;

    // FIND_USER_IF_PRESENT
    const oldUser = await User.findOne({ email: req.body.email });

    if (oldUser) {
      return res.status(statusCode.errorCode).json({
        msg: "This Email address already present",
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

    const userEmail = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          email: req.body.email,
          isVerified: false,
          emailToken: crypto.randomBytes(64).toString("hex"),
        },
      },
      { new: true }
    );

    // FIND_UPDATETED_USER
    const result = await User.findOne({ _id: id });

    // SEND VERIFICATION MAIL
    var mailOption = {
      from: ' "Verify your email" <ajayjangid9299@gmail.com> ',
      to: result.email,
      subject: "Welcome on eatos -verfiy your email",
      html: `<h2> ${result.fname}! Thanks for registering on our site </h2>
        <h4>Please verify your mail to continue...</h4>
        <a href="http://${req.headers.host}/api/user/verify-email?token=${result.emailToken}">Verify Your Email</a>`,
    };

    // FINAL PROCESS FOR MAIL SEND
    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.status(statusCode.successCode).json({
          msg: messageBox.verificationEmailSend,
        });
      }
    });
  } catch (error) {
    res.status(statusCode.errorCode).json({
      msg: error,
    });
  }
};

module.exports = { emailUpdateController };
