import { Project } from "../../models/project.model.js";
import { AppError } from "../../utils/errors.js";
import IProjectRepository from "../contracts/IProjectRepository.js";

class MongoProjectRepository extends IProjectRepository {
    async createProject(data) {
        try {
            const project = await Project.create(data);
            return project;
        } catch (error) {
            throw new AppError(
                "Error creating project: " + error.message,
                500
            )
        }
    }

    async getProjectsByCandidateId(candidateId) {
        try {
            return await Project.find({ candidateId })
                .sort({ createdAt: -1 });
        } catch (error) {
            throw new AppError(
                "Error fetching projects: " + error.message,
                500
            )
        }
    }

    async getProjectById(id) {
        try {
            return await Project.findById(id);
        } catch (error) {
            throw new AppError(
                "Error fetching project: " + error.message,
                500
            )
        }
    }

    async updateProject(id, data) {
        try {
            return await Project.findByIdAndUpdate(
                id,
                data,
                {
                    new: true,
                    runValidators: true
                }
            )
        } catch (error) {
            throw new AppError(
                "Error updating project: " + error.message,
                500
            )
        }
    }

    async deleteProject(id) {
        try {
            return await Project.findByIdAndDelete(id);
        } catch (error) {
            throw new AppError(
                "Error deleting project: " + error.message,
                500
            )
        }
    }
}

export default MongoProjectRepository;