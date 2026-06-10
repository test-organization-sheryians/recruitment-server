import User from "../models/user.model.js";
import { AppError } from "../utils/errors.js";

class AdminProfileService {
  async getProfile(userId) {
    const user = await User.findById(userId).select(
      "firstName lastName email phoneNumber roleId createdAt",
    );

    if (!user) throw new AppError("Admin not found", 404);

    return user;
  }

  async updateProfile(userId, data) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true },
    ).select("firstName lastName email phoneNumber");

    return user;
  }

  async deleteProfile(userId) {
    await User.findByIdAndDelete(userId);
  }
}

export default AdminProfileService;
