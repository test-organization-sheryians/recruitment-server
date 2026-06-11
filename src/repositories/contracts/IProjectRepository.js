export class IProjectRepository {
    async createProject(projectData) {
        throw new Error(
            "Method 'createProject' must be implemented."
        )
    }

    async getProjectsByCandidateId(candidateId) {
        throw new Error(
            "Method 'getProjectsByCandidateId' must be implemented."
        );
    }

    async getProjectById(projectId) {
        throw new Error(
            "Method 'getProjectById' must be implemented."
        );
    }

    async updateProject(projectId, updateData) {
        throw new Error(
            "Method 'updateProject' must be implemented."
        );
    }

    async deleteProject(projectId) {
        throw new Error(
            "Method 'deleteProject' must be implemented."
        );
    }
}

export default IProjectRepository;