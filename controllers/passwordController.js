const { models } = require("../models");
const { User, PasswordReset } = models;
const { sendOTP } = require("../services/otpService");
const bcrypt = require("bcryptjs");

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await PasswordReset.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      userId: user.id,
    });
    console.log(`Password reset OTP for ${email}: ${otp}`);
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;
  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const resetRecord = await PasswordReset.findOne({
      where: { email, otp, isUsed: false },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

     const isPasswordMatch = await bcrypt.compare(newPassword, user.password);
     if (isPasswordMatch) {
       return res
         .status(400)
         .json({
           message: "New password cannot be the same as the current password",
         });
     }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    resetRecord.isUsed = true;
    await resetRecord.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error resetting password", error: err.message });
  }
};
