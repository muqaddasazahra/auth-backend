const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, subject, text) => {

   try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '465', 10), 
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });
    console.log("recepient", email)
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      text,
    });

    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email", error);
    
  }
};

module.exports = { sendEmail };
