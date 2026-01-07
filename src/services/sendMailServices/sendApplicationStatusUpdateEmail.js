import axios from "axios"

const FRONTEND_URL = "https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

export const sendApplicationStatusUpdateEmail = async ({ to, name, jobTitle, status }) => {
  try {
    const payload = {
      sender: {
        name: "Sheriyansh Recruitment Team",
        email: "anshur9608837@gmail.com",
      },
      to: [
        {
          email: to,
          name: name || "Candidate",
        },
      ],
      subject: `Update on your application for ${jobTitle}`,
      htmlContent: `
        <div style="
          background:#f4f4f4;
          padding:30px;
          font-family:Arial, Helvetica, sans-serif;
        ">
          <div style="
            max-width:600px;
            margin:0 auto;
            background:#ffffff;
            border-radius:8px;
            padding:30px;
          ">

            <h2 style="
              margin-top:0;
              color:#1a73e8;
              font-weight:600;
            ">
              Hello ${name || "Candidate"},
            </h2>

            <p style="
              font-size:15px;
              color:#444;
              line-height:1.6;
            ">
              We would like to inform you that the status of your application for the
              <strong>${jobTitle}</strong> position has been updated.
            </p>

            <!-- STATUS BLOCK -->
            <div style="
              margin:24px 0;
              padding:16px 18px;
              background:#f8f9fb;
              border-left:4px solid #1a73e8;
            ">
              <p style="
                margin:0;
                font-size:12px;
                color:#777;
                text-transform:uppercase;
                letter-spacing:0.4px;
              ">
                Current Status
              </p>

              <p style="
                margin:6px 0 0 0;
                font-size:17px;
                font-weight:600;
                color:#1a73e8;
                text-transform:capitalize;
              ">
                ${status}
              </p>
            </div>

            <p style="
              font-size:15px;
              color:#444;
              line-height:1.6;
            ">
              We truly appreciate the time and effort you invested in applying.
              Our recruitment team will reach out to you if there are further steps.
            </p>

            <!-- VISIT MORE JOBS -->
            <div style="
              margin:28px 0;
              padding:16px;
              background:#f1f7ff;
              border-radius:6px;
            ">
              <p style="
                margin:0 0 8px 0;
                font-size:14px;
                color:#333;
                font-weight:600;
              ">
                Looking for more opportunities?
              </p>

              <p style="
                margin:0;
                font-size:14px;
                color:#555;
                line-height:1.6;
              ">
                You can explore and apply for more job openings on our platform:
                <br />
                <a
                  href="${FRONTEND_URL}"
                  target="_blank"
                  style="
                    color:#1a73e8;
                    font-weight:600;
                    text-decoration:none;
                  "
                >
                  Visit available job openings →
                </a>
              </p>
            </div>

            <hr style="
              border:none;
              border-top:1px solid #e6e6e6;
              margin:30px 0;
            " />

            <p style="
              font-size:14px;
              color:#555;
            ">
              Best regards,<br />
              <strong>Sheriyansh Recruitment Team</strong>
            </p>

            <p style="
              font-size:12px;
              color:#888;
              margin-top:20px;
            ">
              © ${new Date().getFullYear()} Sheriyansh. All rights reserved.
            </p>

          </div>
        </div>
      `,
      textContent: `Hello ${name || "Candidate"},

We would like to inform you that the status of your application for the
"${jobTitle}" position has been updated.

Current Status: ${status}

Explore more job opportunities:
${FRONTEND_URL}

Best regards,
Sheriyansh Recruitment Team`,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("APPLICATION STATUS UPDATE EMAIL SENT:", response.data?.messageId)

    return response.data
  } catch (error) {
    console.error(
      "Brevo application status update email failed:",
      error.response?.data || error.message
    )
    throw error
  }
}
