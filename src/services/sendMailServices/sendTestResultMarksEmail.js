import axios from "axios";
import { email_style, logoUrl } from "./constants.js";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

// Test Result Email //

export async function sendTestResultEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheryians Recruitment", email: "hr@sheryians.com" },
      to: [{ email: data.to, name: data.name || "Candidate" }],
      subject: `Test Result Published: ${data.testTitle}`,

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
        Assessment Result
      </h1>
      
      <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
        Hello ${data.name || "Candidate"},<br/><br/>
        The result for your assessment <strong style="color: #1e293b;">${data.testTitle}</strong> has been published. Please find your performance details below.
      </p>

      <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; border-left: 4px solid #000000; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
          Result Summary
        </p>
        <p style="margin: 12px 0 0; font-size: 14px; color: #1e293b;">
          <strong>Score:</strong> ${data.score}
        </p>
        <p style="margin: 4px 0; font-size: 14px; color: #1e293b;">
          <strong>Percentage:</strong> ${data.percentage}%
        </p>
        <p style="margin: 4px 0; font-size: 14px; color: #1e293b;">
          <strong>Status:</strong>
          ${
            data.isPassed
              ? "<span style='color:#15803d; font-weight:700;'>Passed</span>"
              : "<span style='color:#b91c1c; font-weight:700;'>Not Cleared</span>"
          }
        </p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.resultLink}"
           target="_blank"
           style="
             display: inline-block;
             background-color: #2563eb;
             color: #ffffff;
             padding: 14px 32px;
             font-size: 15px;
             font-weight: 600;
             text-decoration: none;
             border-radius: 8px;
             box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
           ">
          View Detailed Result
        </a>
      </div>

      <div style="background: #fafafa; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.5; text-align: center;">
          If shortlisted, our recruitment team will contact you with the next steps.
        </p>
      </div>
    </div>

    <div style="padding: 32px; border-top: 1px solid #f1f5f9; background-color: #fafafa; text-align: center;">
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
`,

      textContent: `
Hello ${data.name || "Candidate"},

Your result for the assessment "${data.testTitle}" has been published.

Score: ${data.score}
Percentage: ${data.percentage}%
Status: ${data.isPassed ? "Passed" : "Not Cleared"}

View detailed result:
${data.resultLink}

Regards,
Sheryians Recruitment Team
  `,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("TEST RESULT EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error(
      "Brevo test result email failed:",
      error.response?.data || error.message,
    );
  }
}
