import axios from "axios"

const FRONTEND_URL = "https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

/**
 * Send password reset email
 */
export async function sendResetPasswordEmail(data) {
  try {
    const resetLink = `${FRONTEND_URL}/reset-password?token=${data.token}`

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
      textContent: `Hi ${
        data.name || "User"
      }, reset your password using this link: ${resetLink} (expires in 15 minutes)`,
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
