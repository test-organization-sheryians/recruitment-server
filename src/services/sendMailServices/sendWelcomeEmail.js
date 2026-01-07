import axios from "axios"

const FRONTEND_URL = "https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

/**
 * Send welcome email after job application
 */
export async function sendWelcomeEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheriyansh", email: "anshur9608837@gmail.com" },
      to: [{ email: data.to, name: data.name }],
      subject: `We received your application for ${data.jobTitle}`,
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h1 style="color: #1a73e8;">Hi ${data.name || "Candidate"}!</h1>
          <p>Thank you for applying to <strong>${
            data.jobTitle
          }</strong> at <strong>Sheriyansh</strong>.</p>
          <p>Your application has been received and is under review.</p>
          <br />
          <p>We'll get back to you soon!</p>
          <hr />
          <small>Applied on: ${new Date(data.appliedAt).toLocaleString()}</small>
        </div>
      `,
      textContent: `Hi ${data.name || "Candidate"}, thank you for applying to ${data.jobTitle}!`,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("WELCOME EMAIL SENT:", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Brevo welcome email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    throw error // Re-throw to let caller handle it
  }
}
