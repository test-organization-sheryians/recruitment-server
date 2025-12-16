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
    async getSavedJobs(userId) {
        const jobs = await this.savedJobRepo.getSavedJob(userId);

        if (!jobs || jobs.length === 0) {
            return []; // return empty list instead of error
        }

        return jobs;
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
