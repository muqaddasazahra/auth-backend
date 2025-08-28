const { sequelize } = require("../config/db"); 
const User = require("../models/user")(sequelize); 
const { generateOTP, sendOTP, verifyOTP } = require("../services/otpService");
const jwt = require("jsonwebtoken");


exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    const otp = generateOTP();
    user.otp = otp;
    await user.save();
    await sendOTP(email, otp);

    res.status(201).json({
      message: "User registered successfully. Check your email for OTP.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error during signup", error: error.message });
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

    if (verifyOTP(otp, user.otp)) {
      user.isVerified = true;
      user.otp = null;
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



