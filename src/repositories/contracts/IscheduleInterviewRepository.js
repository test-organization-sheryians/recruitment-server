class IScheduleInterview {
    async createInterview(data) {
        throw new Error('Method not implemented');
    }

    async getMyInterview(candidateId){
        throw new Error('Method not implemented');
    }

    async getAllInterviews(){
        throw new Error('Method not implemented');
    }

    async updateInterviewStatus(id, status){
        throw new Error('Method not implemented');
    }   

    async deleteInterview(id){
        throw new Error('Method not implemented');
    }
}

export default IScheduleInterview;
