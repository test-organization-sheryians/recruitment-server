import jobAppModel from "../../models/jobCategory.model";
import { AppError } from "../../utils/errors";
import IJobApplicationRepository from "../contracts/IJobApplicationRepository.js";


class MongoApplicationRespository extends IJobApplicationRepository {
            async createJobApplication(jobAppData) {
                        try {
                                    const jobApp = await jobAppModel.create(jobAppData);
                                    return jobApp;
                        } catch (error) {
                                    if (error.code === 11000) {
                                                throw new AppError("Already applied", 409);
                                    }
                                    throw new AppError("Failed to create job application", 500);
                        }
            }
            async findByUserAndJob(userId, jobId) {
                        const jobUserAndJob = await jobAppModel.findOne({ userId, jobId });
                        return jobUserAndJob;
            }
            async updateApplicationStatus(candidateId, status) {
                        try {
                                    const updateApplicationStatus = await jobAppModel.findByIdAndUpdate(candidateId, { status }, { new: true, runValidators: true });
                                    if (!updateApplicationStatus) {
                                                throw new AppError("Application not found", 404);
                                    }
                                    return updateApplicationStatus;
                        } catch (error) {
                                    throw new AppError("Failed to update application status", 500);
                        }
            }
}


export default MongoApplicationRespository;