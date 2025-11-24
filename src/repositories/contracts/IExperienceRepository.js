export class IExperienceRepository {

            async createExperience(experienceData) {
                        throw new Error("Method 'createExperience' must be implemented.");
            }

            async getCandidateExperiences(candidateId) {
                        throw new Error("Method 'getCandidateExperiences' must be implemented.");
            }


            async getExperienceById(experienceId) {
                        throw new Error("Method 'getExperienceById' must be implemented.");
            }


            async updateExperience(experienceId, updateData) {
                        throw new Error("Method 'updateExperience' must be implemented.");
            }


            async deleteExperience(experienceId) {
                        throw new Error("Method 'deleteExperience' must be implemented.");
            }
}


export default IExperienceRepository;