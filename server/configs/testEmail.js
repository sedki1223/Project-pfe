import dotenv from "dotenv";
dotenv.config();
import transporter from "./nodeMailer.js";

console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS loaded:", process.env.SMTP_PASS ? "yes" : "no");

async function testSendEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER, // use SMTP_USER here
      to: "sedkidabboubi46@gmail.com",
      subject: "Test Email from Nodemailer",
      text: "Hello! This is a test email.",
    });
    console.log("Test email sent:", info);
  } catch (err) {
    console.error("Test email error:", err);
  }
}

testSendEmail();
