import FreelancerProfileService from "../services/freelancerProfile.service.js";

class FreelancerProfileController {
  constructor() {
    this.freelancerProfileService = new FreelancerProfileService();
  }

  createProfile = async (req, res, next) => {
    try {
      const profileData = {
        userId: req.user._id,
        ...req.body,
      };
      const profile =
        await this.freelancerProfileService.createProfile(profileData);

      res.status(201).json({
        message: "Freelancer profile created successfully",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req, res, next) => {
    try {
      const profile = await this.freelancerProfileService.findProfileByUserId(
        req.user._id,
      );

      if (!profile) {
        return res.status(404).json({
          message: "Freelancer profile not found",
        });
      }

      res.status(200).json({
        message: "Profile fetched successfully",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  addSkills = async (req, res, next) => {
    try {
      const { skills } = req.body;
      const profile = await this.freelancerProfileService.addSkills(
        req.user._id,
        skills,
      );

      res.status(200).json({
        message: "Skills added successfully",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadResume = async (req, res, next) => {
    try {
      const { resumeFile, portfolioScore } = req.body;
      const profile = await this.freelancerProfileService.uploadResume(
        req.user._id,
        resumeFile,
        portfolioScore,
      );

      res.status(200).json({
        message: "Resume uploaded successfully",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default FreelancerProfileController;
