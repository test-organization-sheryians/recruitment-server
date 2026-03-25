import axios from "axios"


const FRONTEND_URL = "https://hire.sheryians.com"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

/**
 * Send welcome email after job application
 */
export async function sendWelcomeEmail(data) {
  try {
    const payload = {
  sender: { name: "Sheryians Recruitment", email: "hr@sheryians.com" },
  to: [{ email: data.to, name: data.name || "Candidate" }],
  subject: `Application Received: ${data.jobTitle || "Job Position"}`,

  htmlContent: `
  <div style="font-family: Inter, Arial, sans-serif; background:#ffffff; padding:40px;">
    <div style="max-width:620px; margin:0 auto; color:#111827;">

      <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">
        Sheryians Recruitment
      </p>

      <h1 style="font-size:22px; font-weight:600; margin:0 0 20px;">
        Application Received
      </h1>

      <p style="font-size:15px; line-height:1.7; color:#374151; margin-bottom:24px;">
        Hello ${data.name || "Candidate"},<br/><br/>
        Thank you for applying for the <strong>${data.jobTitle}</strong> position.
        We have successfully received your application and our recruitment team
        is currently reviewing it.
      </p>

      <div style="
        border-left:4px solid #111827;
        padding:16px 20px;
        margin-bottom:32px;
        background:#fafafa;
      ">
        <p style="margin:0; font-size:13px; color:#6b7280;">
          Position Applied For
        </p>
        <p style="margin:4px 0 0; font-size:16px; font-weight:500;">
          ${data.jobTitle}
        </p>
        <p style="margin:8px 0 0; font-size:13px; color:#6b7280;">
          Applied on: ${new Date(data.appliedAt).toLocaleString()}
        </p>
      </div>

      <p style="font-size:14px; color:#374151; line-height:1.6;">
        If your profile matches our requirements, you will be contacted for the
        next steps in the hiring process.
      </p>

      <a href="${FRONTEND_URL}"
         style="
           display:inline-block;
           margin-top:24px;
           padding:12px 28px;
           border:1.5px solid #111827;
           color:#111827;
           text-decoration:none;
           font-size:14px;
           font-weight:500;
           border-radius:6px;
         ">
        Visit Recruitment Portal
      </a>

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
Hello ${data.name || "Candidate"},

Thank you for applying for the ${data.jobTitle} position.
We have received your application and our team is reviewing it.

Applied on: ${new Date(data.appliedAt).toLocaleString()}

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
