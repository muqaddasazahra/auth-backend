const crypto = require("crypto");
const { sendEmail } = require("./emailService");

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999); 
  return otp.toString();
};


const sendOTP = async (email, otp) => {
  const subject = "Your OTP for Account Verification";
  const text = `Your OTP for account verification is: ${otp}`;
  await sendEmail(email, subject, text); 
};


const verifyOTP = (userOTP, storedOTP) => {
  return userOTP === storedOTP;
};

module.exports = { generateOTP, sendOTP, verifyOTP };
