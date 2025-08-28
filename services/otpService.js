const crypto = require("crypto");
const { sendEmail } = require("./emailService");
const emailTemplates = require("../config/emailTemplates");

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999); 
  return otp.toString();
};


const sendOTP = async (email, otp, purpose) => {
  if (!emailTemplates[purpose]) {
    throw new Error("Invalid purpose provided");
  }

  const { subject, text } = emailTemplates[purpose];
  const messageText = text(otp);
  await sendEmail(email, subject, messageText);
};

const verifyOTP = (userOTP, storedOTP) => {
  return userOTP === storedOTP;
};

module.exports = { generateOTP, sendOTP, verifyOTP };
