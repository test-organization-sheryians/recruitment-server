import jwt from "jsonwebtoken";
import { resendVerificationEmailService } from "../services/resendMail.service.js";

export const resendVerificationEmailController = async (req, res) => {
  try {
    const token = req.cookies?.access;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    const email = payload.email;

    const result = await resendVerificationEmailService(email);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Resend email failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to resend verification email",
    });
  }
};
