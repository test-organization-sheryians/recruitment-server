import axios from "axios"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

/**
 * Send test assignment/enrollment email to candidate
 */
export async function sendEnrollEmail(data) {
  try {
    const testLink = `https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app/test/${data.testId}`

    const payload = {
      sender: { name: "Sheriyansh Recruitment", email: "anshur9608837@gmail.com" },
      to: [{ email: data.to, name: data.name || "Candidate" }],
      subject: `Test Assigned: ${data.testTitle || "Assessment"}`,
      htmlContent: `
  <div style="font-family: Inter, Arial, sans-serif; background:#ffffff; padding:40px;">
    
    <div style="max-width:620px; margin:0 auto; color:#111827;">
      
      <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">
        Sheriyansh Recruitment
      </p>

      <h1 style="font-size:22px; font-weight:600; margin:0 0 20px;">
        You’ve been assigned an assessment
      </h1>

      <p style="font-size:15px; line-height:1.7; color:#374151; margin-bottom:24px;">
        Hello ${data.name || "Candidate"},<br/><br/>
        You have been invited to complete an online assessment as part of the
        recruitment process. Please review the details below and proceed when ready.
      </p>

      <div style="
        border-left:4px solid #111827;
        padding:16px 20px;
        margin-bottom:32px;
        background:#fafafa;
      ">
        <p style="margin:0; font-size:13px; color:#6b7280;">
          Assessment Title
        </p>
        <p style="margin:4px 0 0; font-size:16px; font-weight:500;">
          ${data.testTitle || "Assessment Test"}
        </p>
      </div>

      <a href="${testLink}"
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
        Open Assessment
      </a>

      <p style="font-size:13px; color:#6b7280; margin:24px 0 6px;">
        Or copy and paste this link into your browser:
      </p>

      <p style="font-size:13px; color:#111827; word-break:break-all;">
        ${testLink}
      </p>

      <hr style="border:none; border-top:1px solid #e5e7eb; margin:36px 0;" />

      <h3 style="font-size:15px; font-weight:600; margin:0 0 12px;">
        Important Guidelines
      </h3>

      <ul style="padding-left:18px; font-size:14px; color:#374151; line-height:1.7; margin:0 0 28px;">
        <li>The assessment can be attempted <strong>only once</strong>. Re-attempts are not allowed.</li>
        <li>Please ensure a stable internet connection before starting the test.</li>
        <li>If you face any technical issues, contact the Sheriyansh Recruitment Team at 
          <a href="mailto:anshur9608837@gmail.com" style="color:#111827; text-decoration:underline;">
            anshur9608837@gmail.com
          </a>.
        </li>
      </ul>

      <div style="
  border-left:4px solid #6b7280;
  background:#f9fafb;
  padding:14px 18px;
  margin-bottom:36px;
">
  <p style="margin:0 0 6px; font-size:13px; color:#6b7280;">
    Explore more opportunities
  </p>
  <p style="margin:0; font-size:14px; color:#111827;">
    Visit our recruitment portal for more job openings and updates:
    <br/>
    <a href="https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app"
       style="color:#111827; text-decoration:underline;">
      recruitment-client-git-dev-anshu-pandeys-projects.vercel.app
    </a>
  </p>
</div>


      <hr style="border:none; border-top:1px solid #e5e7eb; margin:40px 0;" />

      <p style="font-size:13px; color:#6b7280; line-height:1.6;">
        Best regards,<br/>
        <strong style="color:#111827;">Sheriyansh Recruitment Team</strong><br/>
        <span style="font-size:12px;">
          This is an automated message. Please do not reply.
        </span>
      </p>

    </div>
  </div>
`,
      textContent: `
Hello ${data.name || "Candidate"},

You have been assigned an online assessment:
Test Title: ${data.testTitle || "Assessment Test"}

Start here: ${testLink}

Best of luck,
Sheriyansh Recruitment Team
      `,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("ENROLL EMAIL SENT:", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Brevo enroll email failed:", error.response?.data || error.message)
    throw error
  }
}
