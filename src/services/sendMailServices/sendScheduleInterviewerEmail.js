import axios from "axios"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

export async function sendScheduleInterviewerEmail(data) {
  try {
    const payload = {
  sender: { name: "Sheryians Recruitment", email: "hr@sheryians.com" },
  to: [{ email: data.interviewer }],
  subject: `Interview Scheduled: ${data.jobTitle}`,

  htmlContent: `
  <div style="font-family: Inter, Arial, sans-serif; background:#ffffff; padding:40px;">
    <div style="max-width:620px; margin:0 auto; color:#111827;">

      <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">
        Sheryians Recruitment
      </p>

      <h1 style="font-size:22px; font-weight:600; margin:0 0 20px;">
        Interview Scheduled
      </h1>

      <p style="font-size:15px; line-height:1.7; color:#374151; margin-bottom:24px;">
        Dear Interviewer,<br/><br/>
        This is to inform you that an interview has been scheduled.
        Please find the interview details below.
      </p>

      <div style="
        border-left:4px solid #111827;
        padding:16px 20px;
        margin-bottom:32px;
        background:#fafafa;
      ">
        <p style="margin:0; font-size:13px; color:#6b7280;">
          Interview Details
        </p>

        <p style="margin:8px 0 0; font-size:14px;">
          <strong>Candidate Name:</strong> ${data.candidateName}
        </p>
        <p style="margin:4px 0; font-size:14px;">
          <strong>Position:</strong> ${data.jobTitle}
        </p>
        <p style="margin:4px 0; font-size:14px;">
          <strong>Date & Time:</strong> ${new Date(data.Timing).toLocaleString()}
        </p>
      </div>

      <a href="${data.meetingLink}"
         target="_blank"
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
        Join Interview
      </a>

      <p style="font-size:13px; color:#6b7280; margin:24px 0 6px;">
        Or copy and paste this link into your browser:
      </p>

      <p style="font-size:13px; color:#111827; word-break:break-all;">
        ${data.meetingLink}
      </p>

      <div style="
        border-left:4px solid #6b7280;
        background:#f9fafb;
        padding:14px 18px;
        margin:32px 0;
      ">
        <p style="margin:0; font-size:14px; color:#374151;">
          If the scheduled time does not work for you, please reply to this email
          so we can assist with rescheduling.
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

An interview has been scheduled with the following details:

Candidate Name: ${data.candidateName}
Position: ${data.jobTitle}
Date & Time: ${new Date(data.Timing).toLocaleString()}
Meeting Link: ${data.meetingLink}

If the scheduled time does not work for you, please reply to this email.

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

    console.log("SCHEDULE EMAIL SENT (INTERVIEWER):", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Brevo reschedule interviewer email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
}