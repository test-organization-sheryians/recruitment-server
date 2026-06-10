import AdminProfileService from "../services/adminProfile.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class AdminProfileController {
  constructor() {
    this.service = new AdminProfileService();
  }

  getProfile = asyncHandler(async (req, res) => {
    const data = await this.service.getProfile(req.userId);

    res.status(200).json({
      success: true,
      data,
    });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const data = await this.service.updateProfile(req.userId, req.body);

    res.status(200).json({
      success: true,
      data,
      message: "Admin profile updated",
    });
  });

  deleteProfile = asyncHandler(async (req, res) => {
    await this.service.deleteProfile(req.userId);

    res.status(200).json({
      success: true,
      message: "Admin deleted",
    });
  });
}

export default AdminProfileController;
