const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// IMPORT STATUS_CODE_FILE
const { statusCode } = require("../constant/statusCode");

// IMPORT MESSAGE_FILE
const { messageBox } = require("../constant/message");

// IMPORT USER
const User = require("../models/User");

const addTokenVerification = async (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      return res.status(statusCode.errorCode).json({
        msg: messageBox.accessNot,
      });
    }

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);

    // FIND THE USER IN DATABASE
    const data = jwt.decode(token);
    const id = await data._id;
    const userDashboardData = await User.findOne({ _id: id });

    if (!userDashboardData) {
      return res.status(statusCode.errorCode).json({
        msg: messageBox.userNoteExisit,
      });
    }

    next();
  } catch (error) {
    res.status(statusCode.errorCode).json({
      msg: messageBox.invalidTok,
    });
  }
};

module.exports = { addTokenVerification };
