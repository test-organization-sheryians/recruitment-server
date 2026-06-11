import MongoProjectRepository from "../repositories/implementations/mongoProjectRepository.js";
import { AppError } from "../utils/errors.js";

class ProjectService {
    constructor() {
        this.projectRepository = new MongoProjectRepository();
    }

    async addProject(data) {
        if (!data.candidateId) {
            throw new AppError("CandidateId is required", 400);
        }

        if (!data.title) {
            throw new AppError("Project title is required", 400);
        }

        return await this.projectRepository.createProject(data);
    }

    async getCandidateProjects(candidateId, userId) {
        if (!candidateId) {
            throw new AppError("candidateId is required", 400);
        }

        if (candidateId !== userId) {
            throw new AppError(
                "You are not allowed to view these projects",
                401
            );
        }

        return await this.projectRepository.getProjectsByCandidateId(
            candidateId
        );
    }

    async getSingleProject(projectId, userId) {
        if (!projectId) {
            throw new AppError("project id is required", 400);
        }

        const project =
            await this.projectRepository.getProjectById(projectId);

        if (!project) {
            throw new AppError("Project not found", 404);
        }

        if (project.candidateId.toString() !== userId) {
            throw new AppError(
                "You are not allowed to view this project",
                401
            );
        }

        return project;
    }

    async updateProject(projectId, data, userId) {
        if (!projectId) {
            throw new AppError("project id is required", 400);
        }

        const project =
            await this.projectRepository.getProjectById(projectId);

        if (!project) {
            throw new AppError("Project not found", 404);
        }

        if (project.candidateId.toString() !== userId) {
            throw new AppError(
                "You are not allowed to update this project",
                401
            );
        }

        const updated =
            await this.projectRepository.updateProject(
                projectId,
                data
            );

        if (!updated) {
            throw new AppError(
                "Failed to update — Project not found",
                404
            );
        }

        return updated;
    }

    async deleteProject(projectId, userId) {
        if (!projectId) {
            throw new AppError("project id is required", 400);
        }

        const project =
            await this.projectRepository.getProjectById(projectId);

        if (!project) {
            throw new AppError("Project not found", 404);
        }

        if (project.candidateId.toString() !== userId) {
            throw new AppError(
                "You are not allowed to delete this project",
                401
            );
        }

        const deleted =
            await this.projectRepository.deleteProject(projectId);

        if (!deleted) {
            throw new AppError(
                "Failed to delete — Project not found",
                404
            );
        }

        return deleted;
    }
}

export default ProjectService;