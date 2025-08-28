module.exports = {
  passwordReset: {
    subject: "Your OTP for Password Reset",
    text: (otp) => `Your OTP for password reset is: ${otp}`,
  },
  accountVerification: {
    subject: "Your OTP for Account Verification",
    text: (otp) => `Your OTP for account verification is: ${otp}`,
  },

};
