// IMPORT STATUS_CODE_FILE
const { statusCode } = require("../constant/statusCode");
const jwt = require("jsonwebtoken");

// IMPORT USER SCHEMA_FILE
const User = require("../models/User");

const adminDashBoardController = async (req, res) => {
  try {
    const token = await req.header("auth-token");

    // FIND THE USER IN DATABASE
    const data = jwt.decode(token);
    const id = await data._id;
    const userDashboardData = await User.findOne({ _id: id });

    if (userDashboardData.role !== "admin") {
      return res.status(statusCode.errorCode).json({
        msg: "You have not permission to access this route",
      });
    }

    const allUsers = await User.find({ role: "basic" });

    if (allUsers.length === 0) {
      return res.json({
        msg: "No data present in data base",
      });
    }

    res.status(statusCode.successCode).json({
      msg: allUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { adminDashBoardController };
