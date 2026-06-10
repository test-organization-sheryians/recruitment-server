import axios from "axios";
import { email_style, logoUrl } from "./constants.js";

const FRONTEND_URL = "https://hire.sheryians.com";
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Send password reset email with updated Sheryians UI and Logo
 */
export async function sendResetPasswordEmail(data) {
  try {
    const resetLink = `${FRONTEND_URL}/reset-password?token=${data.token}`;

    const payload = {
      sender: { name: "Sheryians Recruitment", email: "hr@sheryians.com" },
      to: [{ email: data.to, name: data.name || "User" }],
      subject: "Reset Your Password",
      htmlContent: `
      ${email_style}
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f8fafc; padding: 40px 10px;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #e2e8f0;">
    
    <div style="background: #000000; padding: 32px 20px; text-align: center;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: auto;">
        <tr>
          <td style="vertical-align: middle;">
          <img src="${logoUrl}" 
             alt="S" 
             width="38" 
             height="38" 
             class="logo-img"
             style="max-height: 38px; 
             width: 40px; 
             display: block; 
             border: 0;
             margin-right: 0px;
             " />
          </td>
          <td style="vertical-align: middle;">
            <span style="color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; line-height: 1;">Sheryians.</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="padding: 40px 32px;">
      <h1 style="font-size: 24px; font-weight: 700; color: #1e293b; margin: 0 0 16px; letter-spacing: -0.5px;">
        Password Reset Request
      </h1>
      
      <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
        Hello ${data.name || "User"},<br/><br/>
        We received a request to reset the password for your Sheryians account. If you didn't make this request, you can safely ignore this email.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}"
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
          Reset Password
        </a>
      </div>

      <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <p style="margin: 0; font-size: 13px; color: #64748b;">
          This link will expire in <strong style="color: #1e293b;">15 minutes</strong> for security reasons.
        </p>
      </div>

      <p style="font-size: 12px; color: #94a3b8; margin: 0 0 8px; text-align: center;">
        If the button doesn't work, copy and paste this URL:
      </p>
      <p style="font-size: 12px; color: #2563eb; word-break: break-all; text-align: center; margin: 0;">
        ${resetLink}
      </p>
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
Hello ${data.name || "User"},

We received a request to reset your password. Use the link below to proceed (valid for 15 minutes):

${resetLink}

If you did not request this, you can safely ignore this email.

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

    console.log("RESET PASSWORD EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Reset password email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
}
