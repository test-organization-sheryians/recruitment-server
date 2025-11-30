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
      to: data.to,
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


export async function sendVerificationEmail(user) {
  const verificationLink = `http://localhost:3000/user-verification/${user.id}`;

  try {
    const info = await transporter.sendMail({
      from: '"Sheriyansh Team" <anshur9608837@gmail.com>',
      to: user.email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 12px; border: 1px solid #eee;">
          <h2 style="color: #1a73e8;">Welcome to Sheriyansh, ${user.name || "there"}!</h2>
          <p>You're almost ready to start. Please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background: #1a73e8; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>

          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #1a73e8;">${verificationLink}</p>

          <hr style="border: 1px solid #ddd; margin: 30px 0;">
          <small style="color: #888;">If you didn’t create an account, you can safely ignore this email.</small>
        </div>
      `,
      text: `Hi ${user.name},\n\nPlease verify your email by visiting this link:\n${verificationLink}\n\nIf you didn't sign up, ignore this email.`,
    });

    logger.info(`Verification email sent to ${user.email} | ${info.messageId}`);
    console.log("Verification email sent:", info.messageId);
    return info;
  } catch (error) {
    logger.error("Failed to send verification email:", error);
    throw error;
  }
}