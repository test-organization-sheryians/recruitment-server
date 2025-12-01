import User from "../models/user.model.js";
import { sendVerificationEmail } from "./sendMail.js";

export const resendVerificationEmailService = async (userId) => {
  const user = await User.findById(userId).select("email name");

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.email) {
    throw new Error("User does not have an email");
  }

  // Reuse existing sendVerificationEmail() from email.js
  await sendVerificationEmail({
    id: user._id,
    email: user.email,
    name: user.name,
  });

  return { success: true, message: "Verification email resent successfully" };
};
