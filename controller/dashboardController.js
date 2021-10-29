// IMPORT STATUS_CODE_FILE
const { statusCode } = require("../constant/statusCode");
const jwt = require("jsonwebtoken");

// IMPORT USER SCHEMA_FILE
const User = require("../models/User");

const dashBoardController = async (req, res) => {
  try {
    const token = await req.header("auth-token");

    // FIND THE USER IN DATABASE
    const data = jwt.decode(token);
    const id = await data._id;

    const userDashboardData = await User.findOne({ _id: id });

    let check = 0;
    userDashboardData.email ? (check = 2) : (check = 1);

    if (check === 1) {
      res.json({
        fname: userDashboardData.fname,
        lname: userDashboardData.lname,
        employeId: userDashboardData.employeId,
        country: userDashboardData.country,
        depName: userDashboardData.depName,
        phone: userDashboardData.phone,
      });
    } else {
      res.json({
        fname: userDashboardData.fname,
        lname: userDashboardData.lname,
        employeId: userDashboardData.employeId,
        country: userDashboardData.country,
        depName: userDashboardData.depName,
        email: userDashboardData.email,
      });
    }
  } catch (error) {
    cosole.log(error);
  }
};

module.exports = { dashBoardController };
