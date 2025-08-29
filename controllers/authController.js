const { sequelize } = require("../config/db"); 
const User = require("../models/user")(sequelize); 
const { generateOTP, sendOTP, verifyOTP } = require("../services/otpService");
const jwt = require("jsonwebtoken");


//---------Standard Sign Up method--------------------

// exports.signup = async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     const user = await User.create({ username, email, password, provider: "Standard" });
//     const otp = generateOTP();
//     user.otp = otp;
//     user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000),
//     await user.save();
//     await sendOTP(email, otp, "accountVerification");

//     res.status(201).json({
//       message: "User registered successfully. Check your email for OTP.",
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error during signup", error: error.message });
//   }
// };


exports.signup = async (req, res) => {
  const { username, email, password, sosCode, socialMedia } = req.body;

  try {
    let user;
    let provider;

    if (sosCode) {
      provider = "SOS";
      user = await User.create({
        provider: "SOS",
        sosCode: sosCode,
      });
    }
    else if (socialMedia) {
      provider = "SocialMedia";
      user = await User.create({
        provider: "SocialMedia",
        socialId: socialMedia,
      });
    }
    else if (username && email && password) {
      provider = "Standard";
      user = await User.create({
        username,
        email,
        password,
        provider: "Standard",
      });
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();
      await sendOTP(email, otp, "accountVerification");
    }
    else {
      return res.status(400).json({
        message:
          "Invalid signup request. Please provide either sosCode, socialMedia, or username/email/password.",
      });
    }

    res.status(201).json({
      message: "User registered successfully.",
      provider,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Error during signup",
      error: error.message,
    });
  }
};


exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }
    
    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (verifyOTP(otp, user.otp)) {
      user.isVerified = true;
      await user.save();

      res.status(200).json({ message: "Account verified successfully, you can now login." });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();
    await sendOTP(email, otp, "accountVerification");

    res.status(201).json({
      message: "OTP sent successfully. Check your email for OTP.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified, please check your email for OTP.",
      });
    }

    if (!(await user.validatePassword(password))) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};



