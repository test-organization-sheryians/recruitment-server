import axios from "axios"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

/**
 * Send interview email to candidate
 */
export async function sendInterviewEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheryians", email: "anshur9608837@gmail.com" },
      to: [{ email: data.candidateEmail, name: data.candidateName }],
      subject: `Interview Scheduled for ${data.jobTitle}`,
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h1 style="color: #1a73e8;">Hi ${data.candidateName || "Candidate"}!</h1>
          <p>Your interview for <strong>${
            data.jobTitle
          }</strong> at <strong>Sheryians</strong> has been scheduled.</p>
          <p><strong>Date & Time:</strong> ${new Date(data.Timing).toLocaleString()}</p>
          <p><strong>Meeting Link:</strong></p>
          <a href="${data.meetingLink}" target="_blank">${data.meetingLink}</a>
          <br /><br />
          <p>Please join on time and ensure a stable internet connection.</p>
          <hr />
          <small>Best of luck!</small>
        </div>
      `,
      textContent: `Hi ${data.candidateName || "Candidate"}, your interview for ${
        data.jobTitle
      } is scheduled on ${new Date(data.Timing).toLocaleString()}. Meeting link: ${
        data.meetingLink
      }`,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("INTERVIEW EMAIL SENT (Candidate):", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Brevo interview email (candidate) failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    throw error
  }
}
