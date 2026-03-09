import axios from "axios"

const FRONTEND_URL = "https://hire.sheryians.com"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

/**
 * Send password reset email
 */
export async function sendResetPasswordEmail(data) {
  try {
    const resetLink = `${FRONTEND_URL}/reset-password?token=${data.token}`

    const payload = {
  sender: { name: "Sheryians Recruitment", email: "hr@sheryians.com" },
  to: [{ email: data.to, name: data.name || "User" }],
  subject: "Reset Your Password",

  htmlContent: `
  <div style="font-family: Inter, Arial, sans-serif; background:#ffffff; padding:40px;">
    <div style="max-width:620px; margin:0 auto; color:#111827;">

      <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">
        Sheryians Recruitment
      </p>

      <h1 style="font-size:22px; font-weight:600; margin:0 0 20px;">
        Reset Your Password
      </h1>

      <p style="font-size:15px; line-height:1.7; color:#374151; margin-bottom:24px;">
        Hello ${data.name || "User"},<br/><br/>
        We received a request to reset your password. Click the button below to
        set a new password. This link is valid for a limited time.
      </p>

      <a href="${resetLink}"
         style="
           display:inline-block;
           padding:12px 28px;
           border:1.5px solid #111827;
           color:#111827;
           text-decoration:none;
           font-size:14px;
           font-weight:500;
           border-radius:6px;
         ">
        Reset Password
      </a>

      <p style="font-size:13px; color:#6b7280; margin:24px 0 6px;">
        Or copy and paste this link into your browser:
      </p>

      <p style="font-size:13px; color:#111827; word-break:break-all;">
        ${resetLink}
      </p>

      <div style="
        border-left:4px solid #6b7280;
        background:#f9fafb;
        padding:14px 18px;
        margin:32px 0;
      ">
        <p style="margin:0; font-size:14px; color:#374151;">
          This reset link will expire in <strong>15 minutes</strong>.
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>

      <hr style="border:none; border-top:1px solid #e5e7eb; margin:40px 0;" />

      <p style="font-size:13px; color:#6b7280; line-height:1.6;">
        Best regards,<br/>
        <strong style="color:#111827;">Sheryians Recruitment Team</strong><br/>
        <span style="font-size:12px;">
          This is an automated message. Please do not reply.
        </span>
      </p>

    </div>
  </div>
  `,

  textContent: `
Hello ${data.name || "User"},

We received a request to reset your password.

Reset your password using the link below (valid for 15 minutes):
${resetLink}

If you did not request this, you can safely ignore this email.

Regards,
Sheryians Recruitment Team
  `,
}


    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("RESET PASSWORD EMAIL SENT:", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Reset password email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    throw error
  }
}
