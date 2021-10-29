try {
  const result = await userAuthJoi.validateAsync(req.body);

  result.email ? (check = 2) : (check = 1);

  // FOR PHONE
  if (check === 1) {
    const numberExist = await User.findOne({ phone: req.body.phone });

    /// CHECK IS USER ALREADY IN DATA_BASE
    if (numberExist)
      return res.status(statusCode.errorCode).json({
        msg: "User already registered!",
      });

    // GENERATE SIX DIGIT OTP
    const OTP = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    // HASH THE OTP AND PASSWORD USING BYCRPT
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    console.log("Otp send Successfully");
    console.log(`Otp is ${OTP}`);

    const user = new User({
      name: req.body.name,
      phone: req.body.phone,
      password: hashedPassword,
    });

    const otp = new Otp({
      phone: req.body.phone,
      otp: OTP,
    });

    try {
      const savedUser = await user.save();
      const savedOtp = await otp.save();
      res.status(statusCode.successCode).json({
        name: savedUser.name,
        phone: savedUser.phone,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // FOR EMAIL
  else if (check === 2) {
    // CHECK IS USER ALREADY IN DATA_BASE
    const lowerCaseEmail = req.body.email.toLowerCase();
    const emailExist = await User.findOne({ email: lowerCaseEmail });
    if (emailExist) {
      return res.status(statusCode.errorCode).json({
        msg: "Email already exists",
      });
    }

    // HASH THE PASSWORD USING BYCRPT
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      email: lowerCaseEmail,
      password: hashedPassword,
      emailToken: crypto.randomBytes(64).toString("hex"),
    });
    try {
      const savedUser = await user.save();

      // SEND VERIFICATION MAIL
      var mailOption = {
        from: ' "Verify your email" <ajayjangid9299@gmail.com> ',
        to: savedUser.email,
        subject: "Welcome on eatos -verfiy your email",
        html: `<h2> ${savedUser.name}! Thanks for registering on our site </h2>
        <h4>Please verify your mail to continue...</h4>
        <a href="http://${req.headers.host}/api/user/verify-email?token=${savedUser.emailToken}">Verify Your Email</a>`,
      };

      // FINAL PROCESS FOR MAIL SEND
      transporter.sendMail(mailOption, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Verification mail is sent to your gamil account");
        }
      });

      res.status(statusCode.successCode).json({
        userData: savedUser,
      });
    } catch (error) {
      res.status(statusCode.errorCode).send(error);
    }
  }
} catch (error) {
  res.status(statusCode.errorCode).json({
    msg: error,
  });
}
