import CandidateProfileService from "../services/candidateProfile.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
 import axios from "axios";
class CandidateProfileController {
  constructor() {
    this.candidateProfileService = new CandidateProfileService();
  }

  createProfile = asyncHandler(async (req, res) => {
    const profileData = {
      ...req.body,
      userId: req.userId,
    };

    const profile = await this.candidateProfileService.createProfile(
      profileData
    );

    res.status(201).json({
      success: true,
      data: profile,
      message: "Profile created successfully",
    });
  });

  getProfile = asyncHandler(async (req, res) => {
    const profile = await this.candidateProfileService.getProfileByUserId(
      req.userId
    );

    res.status(200).json({
      success: true,
      data: profile,
    });
  });

  getProfileById = asyncHandler(async (req, res) => {
   
    
    const profile = await this.candidateProfileService.getProfileByUserId(
      req.params.Id
    );

    res.status(200).json({
      success: true,
      data: profile,
    });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const profileData = req.body;
    console.log(profileData);
    
    const profile = await this.candidateProfileService.updateProfile(
      req.userId,
      profileData
    );
    res.status(200).json({
      success: true,
      data: profile,
      message: "Profile updated successfully",
    });
  });

  deleteProfile = asyncHandler(async (req, res) => {
    await this.candidateProfileService.deleteProfile(req.userId);

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  });

  addSkills = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const skillNames = req.body.skills;

    const profile = await this.candidateProfileService.addSkills(
      userId,
      skillNames
    );

    res.status(200).json({
      success: true,
      data: profile,
      message: "Skills added successfully",
    });
  });

  removeSkill = asyncHandler(async (req, res) => {
    const { skillName } = req.params;

    const profile = await this.candidateProfileService.removeSkill(
      req.userId,
      skillName
    );

    res.status(200).json({
      success: true,
      data: profile,
      message: "Skill removed successfully",
    });
  });

  uploadResume = asyncHandler(async (req, res) => {
    const { resumeFile, resumeScore } = req.body;

    const profile = await this.candidateProfileService.uploadResume(
      req.userId,
      resumeFile,
      resumeScore
    );

    res.status(200).json({
      success: true,
      data: profile,
      message: "Resume uploaded successfully",
    });
  });

  deleteResume = asyncHandler(async (req, res) => {
    const profile = await this.candidateProfileService.deleteResume(
      req.userId
    );

    res.status(200).json({
      success: true,
      data: profile,
      message: "Resume deleted successfully",
    });
  });

  updateAvailability = asyncHandler(async (req, res) => {
    const { availability } = req.body;

    const profile = await this.candidateProfileService.updateAvailability(
      req.userId,
      availability
    );

    res.status(200).json({
      success: true,
      data: profile,
      message: "Availability updated successfully",
    });
  });

 

 getLeetcodeGraph = async (req, res) => {
  try {
    const { username } = req.params;

    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                realName
                ranking
                reputation
                userAvatar
              }
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
          }
        `,
        variables: { username },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com",
        },
      }
    );

    res.json(response.data.data.matchedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch LeetCode data" });
  }
};
}

export default CandidateProfileController;
