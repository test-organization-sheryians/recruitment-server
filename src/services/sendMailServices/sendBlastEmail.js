import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Sends a blast email using Brevo (Axios) with Sheryians styling
 */
export const sendBlastEmail = async ({ email, name, subject, message }) => {
  try {
    const payload = {
      sender: { 
        name: "Sheryians Recruitment", 
        email: "hr@sheryians.com" 
      },
      to: [
        { 
          email: email, 
          name: name || "User" 
        }
      ],
      subject: subject,

      htmlContent: `
      <div style="font-family: Inter, Arial, sans-serif; background:#ffffff; padding:40px;">
        <div style="max-width:620px; margin:0 auto; color:#111827;">

          <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">
            Sheryians Recruitment
          </p>

          <h1 style="font-size:22px; font-weight:600; margin:0 0 20px;">
            ${subject}
          </h1>

          <p style="font-size:15px; line-height:1.7; color:#374151; margin-bottom:24px;">
            Hello ${name || "User"},<br/><br/>
            ${message}
          </p>

          <div style="
            border-left:4px solid #111827;
            padding:16px 20px;
            margin-bottom:32px;
            background:#fafafa;
          ">
            <p style="margin:0; font-size:13px; color:#6b7280;">
              System Notification
            </p>
            <p style="margin:6px 0 0; font-size:14px; font-weight:500;">
              Important Update regarding your account or application.
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
Hello ${name || "User"},

${subject}

${message}

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

    console.log("BLAST EMAIL SENT:", response.data?.messageId);
    return response.data;

  } catch (error) {
    console.error(
      "Brevo blast email failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};