import IJobPostRepository from "../contracts/IJobPost.js";
import PostJob from "../../models/postJob.model.js";

class MongoJobPostRepository extends IJobPostRepository{
    async create(jobPostData){
        try {
            const jobPost = new PostJob(jobPostData);
            return await jobPost.save();
        } catch (error) {
            throw error;
        }
    }
    async findById(id){
        try {
            return await PostJob.findById(id);
        } catch (error) {
            throw error;
        }
    }
    async findAll(){
        try {
            return await PostJob.find();
        } catch (error) {
            throw error;
        }
    }
    async updateById(id, updateData){
        try {
            return await PostJob.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            throw error;
        }
    }
    async deleteById(id){
        try {
            return await PostJob.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}

export default MongoJobPostRepository;