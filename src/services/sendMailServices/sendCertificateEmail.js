import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Send certificate email with S3 download link
 * Called by emailWorker when job.name === "send-certificate"
 */
export async function sendCertificateEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheryians Recruitment", email: "hr@sheryians.com" },
      to: [{ email: data.to, name: data.name || "Candidate" }],
      subject: `Your Internship Certificate is Ready 🎓`,

      htmlContent: `
<div style="font-family: Inter, Arial, sans-serif; background:#ffffff; padding:40px;">
  <div style="max-width:620px; margin:0 auto; color:#111827;">

    <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">Sheryians Recruitment</p>

    <h1 style="font-size:22px; font-weight:600; margin:0 0 20px;">
      Congratulations, ${data.name || "Candidate"}! 🎉
    </h1>

    <p style="font-size:15px; line-height:1.7; color:#374151; margin-bottom:24px;">
      Your internship certificate for <strong>${data.internshipRole}</strong>
      has been generated and is ready to download.
    </p>

    <div style="border-left:4px solid #111827; padding:16px 20px; margin-bottom:32px; background:#fafafa;">
      <p style="margin:0; font-size:13px; color:#6b7280;">Internship Details</p>
      <p style="margin:6px 0 0; font-size:16px; font-weight:500;">${data.internshipRole}</p>
      <p style="margin:4px 0 0; font-size:13px; color:#6b7280;">${data.startDate} — ${data.endDate}</p>
    </div>

    <a href="${data.certificateUrl}" target="_blank"
      style="display:inline-block; padding:12px 28px; background:#111827; color:#ffffff;
             text-decoration:none; font-size:14px; font-weight:500; border-radius:6px;">
      Download Certificate
    </a>

    <hr style="border:none; border-top:1px solid #e5e7eb; margin:40px 0;" />

    <p style="font-size:13px; color:#6b7280; line-height:1.6;">
      Best regards,<br/>
      <strong style="color:#111827;">Sheryians Recruitment Team</strong><br/>
      <span style="font-size:12px;">This is an automated message. Please do not reply.</span>
    </p>

  </div>
</div>`,

      textContent: `Congratulations ${data.name}! Your certificate for ${data.internshipRole} is ready.\nDownload: ${data.certificateUrl}\n\nRegards, Sheryians Recruitment Team`,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("CERTIFICATE EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Brevo certificate email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
}
