import dotenv from "dotenv";
dotenv.config();
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: true,    // log SMTP traffic to console
  debug: true,     // show debug output for SMTP communication
});
console.log("nodemailer config:", {
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS ? "loaded" : "missing",
});
export default transporter