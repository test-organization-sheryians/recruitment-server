import MongoSavedJobRepository from "../repositories/implementations/mongoSavedJobRepository.js";
import { AppError } from "../utils/errors.js";

class SavedJobService {
    constructor(repo) {
        this.savedJobRepo = repo;
    }

    // Save a job for user
    async saveJob(userId, jobId) {
        const saved = await this.savedJobRepo.saveJob(userId, jobId);
        if (!saved) {
            throw new AppError("Failed to save job", 500);
        }
        return saved;
    }

    // Get all saved jobs of a specific user
    async getSavedJobs(userId, page = 1, limit = 10) {
        const result = await this.savedJobRepo.getSavedJob(userId, page, limit);
        return result;
    }

    // Remove a saved job
    async removeSavedJob(userId, jobId) {
        const removed = await this.savedJobRepo.removeSavedJob(userId, jobId);
        if (!removed) {
            throw new AppError("Failed to remove saved job", 404);
        }
        return removed;
    }
}

// Inject repository instance
const savedJobService = new SavedJobService(new MongoSavedJobRepository());

export default savedJobService;
