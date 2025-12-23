import config from "../config/environment.js"
import axios from "axios";
const { FRONTEND_URL } = config;

const BREVO_API_KEY = process.env.BREVO_API_KEY;

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";


export async function sendWelcomeEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheriyansh", email: "anshur9608837@gmail.com" },
      to: [{ email: data.to, name: data.name }],
      subject: `We received your application for ${data.jobTitle}`,
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h1 style="color: #1a73e8;">Hi ${data.name || "Candidate"}!</h1>
          <p>Thank you for applying to <strong>${data.jobTitle}</strong> at <strong>Sheriyansh</strong>.</p>
          <p>Your application has been received and is under review.</p>
          <br />
          <p>We'll get back to you soon!</p>
          <hr />
          <small>Applied on: ${new Date(data.appliedAt).toLocaleString()}</small>
        </div>
      `,
      textContent: `Hi ${data.name}, thank you for applying to ${data.jobTitle}!`,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });
     
    console.log("WELCOME EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Brevo email failed:");
  }
}

export async function sendResetPasswordEmail(data) {
  try {
    const resetLink = `${FRONTEND_URL}/reset-password?token=${data.token}`;

    const payload = {
      sender: { name: "Sheriyansh", email: "anshur9608837@gmail.com" },
      to: [{ email: data.to, name: data.name }],
      subject: "Reset your password",
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h1 style="color: #1a73e8;">Hi ${data.name || "User"}!</h1>

          <p>
            We received a request to reset your password.
            Click the button below to set a new password.
          </p>

          <div style="margin: 30px 0;">
            <a
              href="${resetLink}"
              style="
                background-color:#1a73e8;
                color:#ffffff;
                padding:12px 20px;
                text-decoration:none;
                border-radius:6px;
                display:inline-block;
                font-weight:bold;
              "
            >
              Reset Password
            </a>
          </div>

          <p style="font-size:14px; color:#555;">
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p style="font-size:14px; color:#555;">
            If you did not request this, you can safely ignore this email.
          </p>

          <hr />

          <small style="color:#888;">
            © ${new Date().getFullYear()} Sheriyansh
          </small>
        </div>
      `,
      textContent: `Hi ${data.name || "User"}, reset your password using this link: ${resetLink}`,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("RESET PASSWORD EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Reset password email failed:", error?.message);
  }
}












export async function sendVerificationEmail(user) {
  const verificationLink = `https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app/user-verification/${user.id}`;
    console.log(user)
  try {
    const payload = {
      sender: { name: "Sheriyansh Team", email: "anshur9608837@gmail.com" },
      to: [{ email: user.email, name: user.name }],
      subject: "Verify Your Email Address",
      htmlContent: `
        <div style="font-family: Arial; max-width: 600px; padding: 20px;">
          <h2 style="color: #1a73e8;">Welcome, ${user.name || "there"}!</h2>
          <p>Please verify your email by clicking below:</p>
          
          <a href="${verificationLink}"
            style="background:#1a73e8;color:white;padding:12px 25px;
                   text-decoration:none;border-radius:6px;display:inline-block;margin:20px 0;">
            Verify Email
          </a>

          <p>Or copy this link:</p>
          <p style="word-wrap: break-word; color: #1a73e8;">${verificationLink}</p>

          <hr />
          <small>If you didn’t sign up, ignore this email.</small>
        </div>
      `,
      textContent: `Verify your email: ${verificationLink}`,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("VERIFICATION EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Brevo email failed:", error.response?.data || error.message);
    throw error;
  }
}

export async function sendEnrollEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheriyansh Team", email: "anshur9608837@gmail.com" },
      to: [{ email: data.to, name: data.name || "Candidate" }],
      subject: "You Have Been Assigned a Test",
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h2 style="color: #1a73e8;">Hello ${data.name || "there"}!</h2>
          
          <p>You have been assigned a test on the <strong>Sheriyansh Recruitment Portal</strong>.</p>
          
          <p><strong>Test Title:</strong> ${data.testTitle || "Assessment Test"}</p>

          <a href="https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app/test/${data.testId}"
            style="background:#1a73e8;color:white;padding:12px 25px;
                   text-decoration:none;border-radius:6px;display:inline-block;margin:20px 0;">
            Attempt Test
          </a>

          <p>If the button doesn’t work, copy this link:</p>
          <p style="word-break: break-all; color: #1a73e8;">
            https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app/test/${data.testId}
          </p>

          <hr />
          <small>Best of luck! 🍀</small>
        </div>
      `,
      textContent: `You have been assigned a test. Attempt it here: ${data.testLink}`,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("ENROLL EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error(
      "Brevo enroll email failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}


