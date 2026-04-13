import axios from "axios"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

// Test Result Email //

export async function sendTestResultEmail(data) {
  try {
   const payload = {
  sender: { name: "Sheryians Recruitment", email: "hr@sheryians.com" },
  to: [{ email: data.to, name: data.name || "Candidate" }],
  subject: `Test Result Published: ${data.testTitle}`,

  htmlContent: `
  <div style="font-family: Inter, Arial, sans-serif; background:#ffffff; padding:40px;">
    <div style="max-width:620px; margin:0 auto; color:#111827;">

      <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">
        Sheryians Recruitment
      </p>

      <h1 style="font-size:22px; font-weight:600; margin:0 0 20px;">
        Assessment Result
      </h1>

      <p style="font-size:15px; line-height:1.7; color:#374151; margin-bottom:24px;">
        Hello ${data.name || "Candidate"},<br/><br/>
        The result for your assessment <strong>${data.testTitle}</strong> has
        been published. Please find your performance details below.
      </p>

      <div style="
        border-left:4px solid #111827;
        padding:16px 20px;
        margin-bottom:32px;
        background:#fafafa;
      ">
        <p style="margin:0; font-size:13px; color:#6b7280;">
          Result Summary
        </p>

        <p style="margin:8px 0 0; font-size:14px;">
          <strong>Score:</strong> ${data.score}
        </p>
        <p style="margin:4px 0; font-size:14px;">
          <strong>Percentage:</strong> ${data.percentage}%
        </p>
        <p style="margin:4px 0; font-size:14px;">
          <strong>Status:</strong>
          ${
            data.isPassed
              ? "<span style='color:#15803d; font-weight:600;'>Passed</span>"
              : "<span style='color:#b91c1c; font-weight:600;'>Not Cleared</span>"
          }
        </p>
      </div>

      <a href="${data.resultLink}"
         style="
           display:inline-block;
           padding:12px 28px;
           border:1.5px solid #111827;
           color:#111827;
           text-decoration:none;
           font-size:14px;
           font-weight:500;
           border-radius:6px;
         ">
        View Detailed Result
      </a>

      <p style="font-size:13px; color:#6b7280; margin-top:24px;">
        If shortlisted, our recruitment team will contact you with next steps.
      </p>

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

Your result for the assessment "${data.testTitle}" has been published.

Score: ${data.score}
Percentage: ${data.percentage}%
Status: ${data.isPassed ? "Passed" : "Not Cleared"}

View detailed result:
${data.resultLink}

Regards,
Sheryians Recruitment Team
  `,
}


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
      error.response?.data || error.message
    );
  }
}