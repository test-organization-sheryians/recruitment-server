import CandidateProfileService from "../services/candidateProfile.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class CandidateProfileController {
  constructor() {
    this.candidateProfileService = new CandidateProfileService();
  }

  createProfile = async (req, res) => {
    const profileData = req.body;
    // Assume tenantId comes from auth middleware or req
    profileData.tenantId = req.tenantId || profileData.tenantId;

    const profile = await this.candidateProfileService.createProfile(profileData);
    res.status(201).json({
      success: true,
      data: profile,
      message: "Profile created successfully",
    });
  };

  getProfile = async (req, res) => {
    const { userId } = req.params;
    const tenantId = req.tenantId;
    const profile = await this.candidateProfileService.getProfileByUserId(userId, tenantId);
    res.status(200).json({
      success: true,
      data: profile,
    });
  };

  updateProfile = async (req, res) => {
    const { userId } = req.params;
    const profileData = req.body;
    const profile = await this.candidateProfileService.updateProfile(userId, profileData);
    res.status(200).json({
      success: true,
      data: profile,
      message: "Profile updated successfully",
    });
  };

  deleteProfile = async (req, res) => {
    const { userId } = req.params;
    await this.candidateProfileService.deleteProfile(userId);
    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  };

  addSkills = async (req, res) => {
    const { userId } = req.params;
    const { skillIds } = req.body;
    const profile = await this.candidateProfileService.addSkills(userId, skillIds);
    res.status(200).json({
      success: true,
      data: profile,
      message: "Skills added successfully",
    });
  };

  removeSkill = async (req, res) => {
    const { userId, skillId } = req.params;
    const profile = await this.candidateProfileService.removeSkill(userId, skillId);
    res.status(200).json({
      success: true,
      data: profile,
      message: "Skill removed successfully",
    });
  };

  uploadResume = async (req, res) => {
    const { userId } = req.params;
    const { resumeFile, resumeScore } = req.body;
    const profile = await this.candidateProfileService.uploadResume(userId, resumeFile, resumeScore);
    res.status(200).json({
      success: true,
      data: profile,
      message: "Resume uploaded successfully",
    });
  };

  deleteResume = async (req, res) => {
    const { userId } = req.params;
    const profile = await this.candidateProfileService.deleteResume(userId);
    res.status(200).json({
      success: true,
      data: profile,
      message: "Resume deleted successfully",
    });
  };

  updateAvailability = async (req, res) => {
    const { userId } = req.params;
    const { availability } = req.body;
    const profile = await this.candidateProfileService.updateAvailability(userId, availability);
    res.status(200).json({
      success: true,
      data: profile,
      message: "Availability updated successfully",
    });
  };

  filterBySkills = async (req, res) => {
    const { skills } = req.query;
    // const tenantId = req.tenantId; // Assume from middleware
    const skillArray = skills ? skills.split(',').filter(skill => skill.trim() !== '') : [];
    if (skillArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Skills query parameter is required and must contain at least one valid skill",
      });
    }
    const profiles = await this.candidateProfileService.getProfilesBySkills(skillArray);
    res.status(200).json({
      success: true,
      data: profiles,
    });
  };

}

export default CandidateProfileController;
