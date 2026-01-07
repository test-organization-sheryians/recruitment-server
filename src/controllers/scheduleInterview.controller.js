import ScheduleInterviewService from '../services/scheduleInterview.service.js';

class SchedulInterviewController{
    constructor(){
        this.scheduleInterviewService = new ScheduleInterviewService();
    }

    createInterview = async (req, res, next) => {
        try {
            const interview = {
                ...req.body,
                createdBy: req.userId
            };
            const newInterview = await this.scheduleInterviewService.createInterview(interview);
            res.status(201).json({ success: true, message: "Interview scheduled successfully", data: interview });
        } catch (error) {
            next(error);
        }
    }

    getMyInterviews = async (req, res, next) => {
        try {
            const candidateId = req.userId;
            const interviews = await this.scheduleInterviewService.getMyInterviews(candidateId);
            res.status(200).json({ success: true, count : interviews.length , data: interviews });
        } catch (error) {
            next(error);
        }
        console.log("Logged in user ID:", req.userId);

    }

    getAllInterviews = async (req, res, next) => {
        try {
            const interviews = await this.scheduleInterviewService.getAllInterviews();
            res.status(200).json({ success: true,  count : interviews.length , data: interviews });
        } catch (error) {
            next(error);
        }
    }

    getInterviewById = async (req, res, next) => {
        try {
            const interview = await this.scheduleInterviewService.getInterviewById(req.params.id);
            res.status(200).json({ success: true, data: interview });
        } catch (error) {
            next(error);
        }
    }
    getInterviewByJobId = async (req, res, next) => {
        try {
            const interview = await this.scheduleInterviewService.getInterviewsByJobId(req.params.jobId);
            res.status(200).json({ success: true, data: interview });
        } catch (error) {
            next(error);
        }
    }

    updateInterviewStatus = async (req, res, next) => {
        try {
            const interview = await this.scheduleInterviewService.updateInterviewStatus(req.params.id, req.body.status);
            res.status(200).json({ success: true, data: interview });
        } catch (error) {
            next(error);
        }
    }

    deleteInterview = async (req, res, next) => {
        try {
            await this.scheduleInterviewService.deleteInterview(req.params.id);
            res.status(200).json({ success: true, message: "Interview deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

export default new SchedulInterviewController();
    
    















