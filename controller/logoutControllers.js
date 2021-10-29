// IMPORT STATUS_CODE_FILE
const { statusCode } = require("../constant/statusCode");

// IMPORT MESSAGE_FILE
const { messageBox } = require("../constant/message");

const logoutController = async (req, res) => {
  res.status(statusCode.successCode).json({
    msg: messageBox.logoutMess,
  });
};

module.exports = { logoutController };
