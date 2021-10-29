const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

dotenv.config();

// IMPORT MESSAGE_FILE
const { messageBox } = require("../constant/message");

// IMPORT USER_SCHEMA
const User = require("../models/User");

// IMPORT JOI_PASSWORD_FILE
const { joiPassword } = require("../joiSchema/joiManProfileUpdate");
const { statusCode } = require("../constant/statusCode");

const userPassController = async (req, res) => {
  try {
    // VALIDATE PASSWORD
    const validData = await joiPassword.validateAsync(req.body);

    const token = await req.header("auth-token");
    const data = jwt.decode(token);
    const id = await data._id;

    const oldUser = await User.findById({ _id: id });

    const oldPassword = oldUser.password;

    // OLD_PASSWORD CHECK
    const validPass = await bcrypt.compare(validData.passwordOld, oldPassword);

    if (!validPass) {
      return res.status(statusCode.errorCode).json({
        msg: "Old password does not match",
      });
    }

    // HASH PASSWORD USING BCRYPT
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.passwordNew, salt);

    // UPDATE USER PASSWORD
    const userEmail = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    res.json({
      msg: messageBox.passUpdate,
    });
  } catch (error) {
    res.status(statusCode.errorCode).json({
      msg: error,
    });
  }
};

module.exports = { userPassController };
