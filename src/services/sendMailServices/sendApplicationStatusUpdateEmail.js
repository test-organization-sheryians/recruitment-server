import axios from "axios";
import { email_style, logoUrl } from "./constants.js";

const FRONTEND_URL = "https://hire.sheryians.com";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

export const sendApplicationStatusUpdateEmail = async ({
  to,
  name,
  jobTitle,
  status,
}) => {
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
        Application Status Update
      </h1>
      
      <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
        Hello ${name || "Candidate"},<br/><br/>
        We would like to inform you that the status of your application for the 
        <strong style="color: #1e293b;">${jobTitle}</strong> position has been updated.
      </p>

      <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; border-left: 4px solid #000000; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
          Current Application Status
        </p>
        <p style="margin: 8px 0 0; font-size: 18px; color: #1e293b; font-weight: 700; text-transform: capitalize;">
          ${status}
        </p>
      </div>

      <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 32px;">
        We truly appreciate the time and effort you invested in applying. 
        If there are any further steps, our recruitment team will reach out to you directly.
      </p>

      <div style="text-align: center; margin-bottom: 10px;">
        <a href="${FRONTEND_URL}"
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
          Explore More Opportunities
        </a>
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
Hello ${name || "Candidate"},

The status of your application for the "${jobTitle}" position has been updated.

Current Status: ${status}

You can explore more job opportunities here:
${FRONTEND_URL}

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

    console.log(
      "APPLICATION STATUS UPDATE EMAIL SENT:",
      response.data?.messageId,
    );

    return response.data;
  } catch (error) {
    console.error(
      "Brevo application status update email failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
