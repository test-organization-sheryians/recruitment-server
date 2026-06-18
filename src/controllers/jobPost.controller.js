import JobPostService from "../services/jobPost.service.js";
import {asyncHandler} from "../utils/asyncHandler.js";

class JobPostController{
    constructor(){
        this.jobPostService = new JobPostService();
    }

    //Create job post
    createJobPost = asyncHandler(async (req, res) => {
        const jobPost = await this.jobPostService.createJobPost(req.body);
        return res.status(201).json({ success: true, data: jobPost, message: "Job post created" });
    });

    //Get job post by id
    getJobPostById = asyncHandler(async (req, res) => {
        const jobPost = await this.jobPostService.getJobPostById(req.params.id);
        return res.status(200).json({ success: true, data: jobPost, message: "Job post fetched" });
    });

    //Get all job posts
    getAllJobPosts = asyncHandler(async (req, res) => {
        const jobPosts = await this.jobPostService.getAllJobPosts();
        return res.status(200).json({ success: true, data: jobPosts, message: "Job posts fetched" });
    });

    //Update job post
    updateJobPost = asyncHandler(async (req, res) => {
        const jobPost = await this.jobPostService.updateJobPost(req.params.id, req.body);
        return res.status(200).json({ success: true, data: jobPost, message: "Job post updated" });
    });

    //Delete job post
    deleteJobPost = asyncHandler(async (req, res) => {
        const jobPost = await this.jobPostService.deleteJobPost(req.params.id);
        return res.status(200).json({ success: true, data: jobPost, message: "Job post deleted" });
    });
}

export default new JobPostController();