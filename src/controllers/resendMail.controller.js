import { resendVerificationEmailService } from "../services/resendMail.service.js";

export const resendVerificationEmailController = async (req, res) => {
  try {
    const userId = req.userId; // ✅ matches middleware


    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await resendVerificationEmailService(userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Resend email failed:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to resend verification email",
    });
  }
};
