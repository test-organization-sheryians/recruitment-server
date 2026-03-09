import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

export async function sendCertificateEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheryians Recruitment", email: "hr@sheryians.com" },
      to: [{ email: data.to, name: data.studentName || "Student" }],
      subject: "Your Certificate is Ready",
      htmlContent: `
      <div style="font-family: Inter, Arial, sans-serif; background:#ffffff; padding:40px;">
        <div style="max-width:620px; margin:0 auto; color:#111827;">
          <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">Sheryians Recruitment</p>
          <h1 style="font-size:22px; font-weight:600; margin:0 0 20px;">Certificate Generated</h1>
          <p style="font-size:15px; line-height:1.7; color:#374151; margin-bottom:24px;">
            Hello ${data.studentName || "Student"},<br/><br/>
            Your certificate has been generated successfully.
          </p>
          <a href="${data.certificateUrl}"
             target="_blank"
             style="display:inline-block;padding:12px 28px;border:1.5px solid #111827;color:#111827;text-decoration:none;font-size:14px;font-weight:500;border-radius:6px;">
            View Certificate
          </a>
          <p style="font-size:13px; color:#6b7280; margin:24px 0 6px;">Or copy this link:</p>
          <p style="font-size:13px; color:#111827; word-break:break-all;">${data.certificateUrl}</p>
        </div>
      </div>
      `,
      textContent: `
Hello ${data.studentName || "Student"},

Your certificate has been generated successfully.
Certificate link: ${data.certificateUrl}

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
