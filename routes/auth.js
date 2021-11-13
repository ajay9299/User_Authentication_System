// IMPORT ROUTER
const router = require("express").Router();

// <-----------------------------------------------Import Controller----------------------------------------------->

const { registerController } = require("../controller/registerController");
const { loginController } = require("../controller/loginController");
const { dashBoardController } = require("../controller/dashboardController");
const { logoutController } = require("../controller/logoutControllers");
const { profileUpController } = require("../controller/profileUpController");
const { emailUpdateController } = require("../controller/emailUpdate");
const { userPassController } = require("../controller/passUpdate");
const { phoneUpdateController } = require("../controller/phoneUpdate");
const { resendOtp } = require("../controller/resendOtp");
const { mapsController } = require("../controller/mapsController");
const { adminLoginController } = require("../controller/adminLogin");
const { adminDashBoardController } = require("../controller/adminDashBoard");

// <-----------------------------------------------Import Middlewares----------------------------------------------->

const { addEmailVerifiy } = require("../middleware/emailValidate");
const { addTokenVerification } = require("../middleware/verifyToken");
const { addOtpVerifiy } = require("../middleware/otpValidate");

// <-----------------------------------------------Requests Methods----------------------------------------------->

// FOR USER SIGNUP
router.post("/register", registerController);

// FOR MAIL VERIFY
router.get("/verify-email", addEmailVerifiy);

// FOR OTP VERIFY
router.post("/verify-otp", addOtpVerifiy);

// FOR USER LOGIN
router.post("/login", loginController);

// For ADMIN LOGIN
router.post("/login/admin", adminLoginController);

// FOR USER DASHBOARD
router.get("/dashboard", addTokenVerification, dashBoardController);

// FOR ADMIN DASHBOARD
router.get("/dashboard/admin", adminDashBoardController);

// FOR USER PROFILE UPDATE
router.post("/profile-update", addTokenVerification, profileUpController);

// FOR USER EMAIL-UPDATE
router.post(
  "/profile-update-email",
  addTokenVerification,
  emailUpdateController
);

// FOR USER PHONE-UPDATE
router.post(
  "/profile-update-phone",
  addTokenVerification,
  phoneUpdateController
);

// FOR USER PASSWORD-UPDATE
router.post(
  "/profile-update-password",
  addTokenVerification,
  userPassController
);

// FOR RESEND OTP
router.post("/resent-otp", resendOtp);

// FOR USER LOGOUT
router.get("/logout", logoutController);

// FOR MAPS API
router.get("/maps", mapsController);

module.exports = router;
