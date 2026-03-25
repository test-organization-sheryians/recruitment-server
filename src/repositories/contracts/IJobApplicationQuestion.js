export class IJobApplicationQuestion{
    async createApplicationQuestion(jobId,data){
        throw new Error("Method createQuestion must be implemented");
    }
    async getApplicationQuestion(jobId){
        throw new Error("Method getApplication must be implemented");
    }
    async updateApplicationQuestion(jobid,questionId,data){
        throw new Error("Method updateApplicationQuestion must be implemented");
        
    }

    async deleteApplicationQuestion(jobId, questionId){
        throw new Error("Method deleteApplicationQuestion must be implemented");
    }


}