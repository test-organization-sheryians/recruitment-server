import User from "../models/user.model.js";

export const handleGoogleLogin = async (userData) => {
  const { email, firstName, lastName, googleId } = userData;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      firstName,
      lastName,
      email,
      googleId,
    });
  }

  return user;
};
