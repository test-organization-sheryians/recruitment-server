import ProjectService from "../services/project.service.js";

class ProjectController {
  constructor() {
    this.projectService = new ProjectService();
  }

  // Create Project
  createProject = async (req, res) => {
    try {
      const projectData = {
        ...req.body,
      };

      const result = await this.projectService.addProject(projectData);

      res.status(201).json({
        success: true,
        message: "Project added successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  // Get all projects of a candidate
  getCandidateProjects = async (req, res) => {
    try {
      const { candidateId } = req.params;
      const userId = req.userId;

      const result =
        await this.projectService.getCandidateProjects(
          candidateId,
          userId
        );

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

  // Get single project
  getSingleProject = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const result =
        await this.projectService.getSingleProject(
          id,
          userId
        );

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

  // Update project
  updateProject = async (req, res) => {
    try {
      const projectId = req.params.id;
      const userId = req.userId;
      const data = req.body;

      const result =
        await this.projectService.updateProject(
          projectId,
          data,
          userId
        );

      res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  // Delete project
  deleteProject = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      await this.projectService.deleteProject(
        id,
        userId
      );

      res.status(200).json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  };
}

export default ProjectController;