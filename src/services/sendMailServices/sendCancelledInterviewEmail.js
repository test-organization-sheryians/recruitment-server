import axios from "axios";
import { email_style, logoUrl } from "./constants.js";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

export async function sendCancelledInterviewEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheryians Recruitment", email: "hr@sheryians.com" },
      to: [
        { email: data.candidateEmail, name: data.candidateName || "Candidate" },
      ],
      subject: `Interview Cancelled: ${data.jobTitle}`,

      htmlContent: `
      ${email_style}
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f8fafc; padding: 40px 10px;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #e2e8f0;">
    
    <div style="background: #000000; padding: 32px 20px; text-align: center;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: auto;">
        <tr>
          <td style="vertical-align: middle;">
            <img src="${logoUrl}" alt="Sheryians Logo" 
            class="logo-img"
            style="max-height: 35px; width: auto; display: block; margin-right: 8px;" />
          </td>
          <td style="vertical-align: middle;">
            <span style="color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; line-height: 1;">Sheryians.</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="padding: 40px 32px;">
      <h1 style="font-size: 24px; font-weight: 700; color: #1e293b; margin: 0 0 16px; letter-spacing: -0.5px;">
        Interview Cancelled
      </h1>
      
      <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
        Hello ${data.candidateName || "Candidate"},<br/><br/>
        We regret to inform you that your interview for the 
        <strong style="color: #1e293b;">${data.jobTitle}</strong> position has been cancelled.
      </p>

      <div style="background: #fef2f2; border-radius: 8px; padding: 20px; border-left: 4px solid #b91c1c; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #991b1b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
          Interview Status
        </p>
        <p style="margin: 8px 0 0; font-size: 18px; color: #b91c1c; font-weight: 700;">
          Cancelled
        </p>
        <p style="margin: 6px 0 0; font-size: 14px; color: #475569;">
          <strong>Position:</strong> ${data.jobTitle}
        </p>
      </div>

      <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.5;">
          If this cancellation was unintentional or if rescheduling is required, our recruitment team will contact you with further details.
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />

      <div style="text-align: center;">
        <p style="font-size: 13px; color: #64748b; margin: 0;">
          Best regards,<br/>
          <strong style="color: #1e293b;">Sheryians Recruitment Team</strong>
        </p>
        <p style="font-size: 11px; color: #cbd5e1; margin-top: 12px;">
          This is an automated system message. Please do not reply directly to this email.
        </p>
      </div>
    </div>

  </div>
</div>
`,

      textContent: `
Hello ${data.candidateName || "Candidate"},

Your interview for the ${data.jobTitle} position has been cancelled.

If rescheduling is required, our recruitment team will contact you.

Regards,
Sheryians Recruitment Team
  `,
    };

    return (
      await axios.post(BREVO_URL, payload, {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      })
    ).data;
  } catch (err) {
    throw err;
  }
}
