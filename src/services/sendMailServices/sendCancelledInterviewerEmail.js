import axios from "axios"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

export async function sendCancelledInterviewerEmail(data) {
  try {
    const payload = {
  sender: { name: "Sheryians Recruitment", email: "hr@sheryians.com" },
  to: [{ email: data.interviewer }],
  subject: `Interview Cancelled: ${data.jobTitle}`,

  htmlContent: `
  <div style="font-family: Inter, Arial, sans-serif; background:#ffffff; padding:40px;">
    <div style="max-width:620px; margin:0 auto; color:#111827;">

      <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">
        Sheryians Recruitment
      </p>

      <h1 style="font-size:22px; font-weight:600; margin:0 0 20px;">
        Interview Cancelled
      </h1>

      <p style="font-size:15px; line-height:1.7; color:#374151; margin-bottom:24px;">
        Dear Interviewer,<br/><br/>
        Please note that the following interview has been cancelled.
        No further action is required from your side.
      </p>

      <div style="
        border-left:4px solid #b91c1c;
        padding:16px 20px;
        margin-bottom:32px;
        background:#fef2f2;
      ">
        <p style="margin:0; font-size:13px; color:#6b7280;">
          Interview Details
        </p>

        <p style="margin:6px 0 0; font-size:14px;">
          <strong>Candidate Name:</strong> ${data.candidateName}
        </p>
        <p style="margin:4px 0; font-size:14px;">
          <strong>Position:</strong> ${data.jobTitle}
        </p>
        <p style="margin:4px 0; font-size:14px; font-weight:600; color:#b91c1c;">
          Status: Cancelled
        </p>
      </div>

      <div style="
        border-left:4px solid #6b7280;
        background:#f9fafb;
        padding:14px 18px;
        margin:24px 0;
      ">
        <p style="margin:0; font-size:14px; color:#374151;">
          If any updates or rescheduling are required, the recruitment team
          will notify you accordingly.
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
Dear Interviewer,

The interview with ${data.candidateName} for the ${data.jobTitle} position
has been cancelled.

No further action is required from your side.

Regards,
Sheryians Recruitment Team
  `,
}


    return (await axios.post(BREVO_URL, payload, {
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
    })).data;
  } catch (err) {
    throw err;
  }
}
