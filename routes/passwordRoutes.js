const express = require("express");
const router = express.Router();
const {
  requestPasswordReset,
  verifyResetOTP,
  resetPassword,
} = require("../controllers/passwordController");

router.post("/forgot-password", requestPasswordReset);
router.post("/verify-forgot-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
