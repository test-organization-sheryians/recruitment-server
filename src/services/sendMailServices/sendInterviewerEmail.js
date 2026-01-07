import axios from "axios"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

/**
 * Send interview notification to interviewer
 */
export async function sendInterviewerEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheryians", email: "anshur9608837@gmail.com" },
      to: [{ email: data.interviewer }],
      subject: `Interview Scheduled for ${data.jobTitle}`,
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h1 style="color: #1a73e8;">Dear Interviewer,</h1>
          <p>I hope this email finds you well.</p>
          <p>This is to inform you that an interview has been scheduled for the following candidate:</p>
          <p><strong>Candidate Name:</strong> ${data.candidateName}</p>
          <p><strong>Position:</strong> ${data.jobTitle}</p>
          <p><strong>Date & Time:</strong> ${new Date(data.Timing).toLocaleString()}</p>
          <p><strong>Meeting Link:</strong></p>
          <a href="${data.meetingLink}" target="_blank">${data.meetingLink}</a>
          <br /><br />
          <p>Kindly let us know if the scheduled time works for you or if any adjustments are required.</p>
          <p>Please feel free to reach out if you have any questions or need further information.</p>
          <p>Thank you for your time and cooperation.</p>
          <hr />
          <small>Best regards,<br />Sheryians Team</small>
        </div>
      `,
      textContent: `Dear Interviewer, an interview has been scheduled for candidate ${
        data.candidateName
      } for the position ${data.jobTitle} on ${new Date(
        data.Timing
      ).toLocaleString()}. Meeting link: ${data.meetingLink}`,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("INTERVIEW EMAIL SENT (Interviewer):", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Brevo interviewer email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    throw error
  }
}
