import axios from "axios"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

const FRONTEND_URL = "http://localhost:3000"

export async function sendBlogPublishedEmail(data) {

  try {

    const blogLink = `${FRONTEND_URL}/blog/${data.blogSlug}`

    const payload = {

      sender: {
        name: "InsightfulBlog",
        email: "hr@sheryians.com"
      },

      to: [
        {
          email: data.to,
          name: "Reader"
        }
      ],

      subject: `New Blog Published: ${data.blogTitle}`,

htmlContent: `

<div style="font-family: Inter, Arial, sans-serif; background:#ffffff; padding:40px;">
  
  <div style="max-width:620px; margin:0 auto; color:#111827;">
    
    <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">
      InsightfulBlog
    </p>

    <h1 style="font-size:22px; font-weight:600; margin:0 0 20px;">
      New Blog Published
    </h1>

    <p style="font-size:15px; line-height:1.7; color:#374151; margin-bottom:24px;">
      A new article has been published on our blog.
      Click below to read it.
    </p>

    <div style="
      border-left:4px solid #111827;
      padding:16px 20px;
      margin-bottom:32px;
      background:#fafafa;
    ">

      <p style="margin:0; font-size:13px; color:#6b7280;">
        Blog Title
      </p>

      <p style="margin:4px 0 0; font-size:16px; font-weight:500;">
        ${data.blogTitle}
      </p>

    </div>

    <a href="${blogLink}"
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
      Read Article
    </a>

    <p style="font-size:13px; color:#6b7280; margin:24px 0 6px;">
      Or copy and paste this link into your browser:
    </p>

    <p style="font-size:13px; color:#111827; word-break:break-all;">
      ${blogLink}
    </p>

    <div style="
      border-left:4px solid #6b7280;
      background:#f9fafb;
      padding:14px 18px;
      margin:32px 0;
    ">
      <p style="margin:0; font-size:14px; color:#374151;">
        Stay updated with our latest blogs and insights.
      </p>
    </div>

    <hr style="border:none; border-top:1px solid #e5e7eb; margin:40px 0;" />

    <p style="font-size:13px; color:#6b7280; line-height:1.6;">
      Best regards,<br/>
      <strong style="color:#111827;">InsightfulBlog Team</strong><br/>
      <span style="font-size:12px;">
        This is an automated message. Please do not reply.
      </span>
    </p>

  </div>

</div>

`,

textContent: `

New Blog Published

Title: ${data.blogTitle}

Read here:
${blogLink}

InsightfulBlog Team

`
    }


    const response = await axios.post(BREVO_URL, payload, {

      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json"
      }

    })

    console.log("BLOG EMAIL SENT:", response.data.messageId)

  }

  catch(error){

    console.error("Blog email failed:", error.response?.data || error.message)

    throw error
  }

}