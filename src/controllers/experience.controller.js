import ExperienceService from "../services/experience.service.js";

class ExperienceController {
  constructor() {
    this.experienceService = new ExperienceService(); 
  }

  // Create experience
  createExperience = async (req, res) => {
    try {
      const data = req.body;
      const result = await this.experienceService.addExperience(data); 

      res.status(201).json({
        success: true,
        message: "Experience added successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  // Get all experiences of a candidate
  getCandidateExperiences = async (req, res) => {
    try {
      const { candidateId } = req.params;

      const result =
        await this.experienceService.getCandidateExperiences(candidateId); 

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  // Get single experience
  getSingleExperience = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.experienceService.getSingleExperience(id); 

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  };

  // Update experience
  updateExperience = async (req, res) => {
    try {
      const  candidateId  = req.params.id;
     
      const data = req.body;

      const result = await this.experienceService.updateExperience(candidateId, data); // FIXED

      res.status(200).json({
        success: true,
        message: "Experience updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  // Delete experience
  deleteExperience = async (req, res) => {
    try {
      const { id } = req.params;

      await this.experienceService.deleteExperience(id); // FIXED

      res.status(200).json({
        success: true,
        message: "Experience deleted successfully",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  };
}

export default ExperienceController;
