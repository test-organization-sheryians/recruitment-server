import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  requireTLS: true,
   auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,              
  },
});
transporter.verify((error) => {
  if (error) {
    logger.error("Gmail SMTP connection failed:", error);
  } else {
    logger.info("Gmail SMTP ready — emails will send!");
    console.log("Gmail SMTP CONNECTED — READY TO SEND");
  }
});

export async function sendWelcomeEmail(data) {
  try {
    const info = await transporter.sendMail({
      from: 'anshur9608837@gmail.com',
      to: 'muskansinha803101@gmail.com',
      subject: `We received your application for ${data.jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h1 style="color: #1a73e8;">Hi ${data.name || "Candidate"}!</h1>
          <p>Thank you for applying to <strong>${
            data.jobTitle
          }</strong> at <strong>Sheriyansh</strong>.</p>
          <p>Your application has been received and is under review.</p>
          <br>
          <p>We'll get back to you soon!</p>
          <hr>
          <small style="color: #666;">
            Applied on: ${new Date(data.appliedAt).toLocaleString()}
          </small>
        </div>
      `,
      text: `Hi ${data.name}, thanks for applying to ${
        data.jobTitle
      } at Sheriyansh! Applied on: ${new Date(
        data.appliedAt
      ).toLocaleString()}`,
    });

    console.log("EMAIL SENT SUCCESSFULLY!", info.messageId);
    logger.info(
      `Welcome email sent to ${data.to} | MessageId: ${info.messageId}`
    );
    return info;
  } catch (error) {
    console.error("FAILED TO SEND EMAIL:", error.message);
    logger.error("Email send failed:", error);
    throw error; 
  }
}