import User from "../models/user.model.js";
import { sendVerificationEmail } from "./sendMail.js";

export const resendVerificationEmailService = async (email) => {
  const user = await User.findOne({ email }).select("email name isVerified");

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("Email is already verified");
  }

  if (!user.email) {
    throw new Error("User does not have an email");
  }

  // Reuse existing sendVerificationEmail()
  await sendVerificationEmail({
    id: user._id,
    email: user.email,
    name: user.name,
  });

  return { success: true, message: "Verification email resent successfully" };
};
