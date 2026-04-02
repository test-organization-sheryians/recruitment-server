import nodemailer from "nodemailer";

export const sendBlastEmail = async ({ email, name, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    to: email,
    subject,
    html: `
      <div style="font-family: Arial; padding: 10px">
        <h2>Hello ${name || "User"},</h2>
        <p>${message}</p>
        <br/>
        <p style="font-size:12px;color:gray">
          This is a system notification.
        </p>
      </div>
    `,
  });
};