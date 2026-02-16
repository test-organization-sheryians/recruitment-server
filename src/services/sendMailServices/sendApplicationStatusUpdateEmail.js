import axios from "axios"

const FRONTEND_URL = "https://hire.sheryians.com"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

export const sendApplicationStatusUpdateEmail = async ({ to, name, jobTitle, status }) => {
  try {
    const payload = {
  sender: {
    name: "Sheryians Recruitment",
    email: "hr@sheryians.com",
  },
  to: [
    {
      email: to,
      name: name || "Candidate",
    },
  ],
  subject: `Application Status Update: ${jobTitle}`,

  htmlContent: `
  <div style="font-family: Inter, Arial, sans-serif; background:#ffffff; padding:40px;">
    <div style="max-width:620px; margin:0 auto; color:#111827;">

      <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">
        Sheryians Recruitment
      </p>

      <h1 style="font-size:22px; font-weight:600; margin:0 0 20px;">
        Application Status Update
      </h1>

      <p style="font-size:15px; line-height:1.7; color:#374151; margin-bottom:24px;">
        Hello ${name || "Candidate"},<br/><br/>
        We would like to inform you that the status of your application for the
        <strong>${jobTitle}</strong> position has been updated.
      </p>

      <div style="
        border-left:4px solid #111827;
        padding:16px 20px;
        margin-bottom:32px;
        background:#fafafa;
      ">
        <p style="margin:0; font-size:13px; color:#6b7280;">
          Current Application Status
        </p>

        <p style="margin:6px 0 0; font-size:16px; font-weight:600; text-transform:capitalize;">
          ${status}
        </p>
      </div>

      <p style="font-size:14px; color:#374151; line-height:1.6;">
        We truly appreciate the time and effort you invested in applying.
        If there are any further steps, our recruitment team will reach out to you.
      </p>

      <a href="${FRONTEND_URL}"
         target="_blank"
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
        Explore More Job Opportunities
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
Hello ${name || "Candidate"},

The status of your application for the "${jobTitle}" position has been updated.

Current Status: ${status}

You can explore more job opportunities here:
${FRONTEND_URL}

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

    console.log("APPLICATION STATUS UPDATE EMAIL SENT:", response.data?.messageId)

    return response.data
  } catch (error) {
    console.error(
      "Brevo application status update email failed:",
      error.response?.data || error.message
    )
    throw error
  }
}
