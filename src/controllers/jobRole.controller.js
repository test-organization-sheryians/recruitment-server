import JobRoleService from "../services/jobRole.service.js";

class JobRoleController {
  constructor() {
    this.jobRoleService = new JobRoleService();
  }

  createJobRole = async (req, res, next) => {
    try {
      const jobRoleData = {
        ...req.body,
        createdBy: req.userId
      };

      const jobRole = await this.jobRoleService.createJobRole(jobRoleData);
      res.status(201).json({
        success: true,
        message: "Job role created successfully",
        data: jobRole
      });
    } catch (error) {
      next(error);
    }
  };

  getAllJobRoles = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await this.jobRoleService.getAllJobRoles(req.query, req.userId, page, limit);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  };

  getJobRoleById = async (req, res, next) => {
    try {
      const jobRole = await this.jobRoleService.getJobRoleById(req.params.id, req.userId);
      res.status(200).json({
        success: true,
        data: jobRole
      });
    } catch (error) {
      next(error);
    }
  };

  updateJobRole = async (req, res, next) => {
    try {
      const jobRole = await this.jobRoleService.updateJobRole(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Job role updated successfully",
        data: jobRole
      });
    } catch (error) {
      next(error);
    }
  };

  deleteJobRole = async (req, res, next) => {
    try {
      await this.jobRoleService.deleteJobRole(req.params.id);
      res.status(200).json({
        success: true,
        message: "Job role deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  getJobRolesByClient = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await this.jobRoleService.getJobRolesByClient(req.params.clientId, page, limit);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  };

  getJobRolesByCategory = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const userId = req.userId
      const result = await this.jobRoleService.getJobRolesByCategory(req.params.categoryId,page,limit,userId);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.log(error);
      
      next(error);
    }
  };

  getActiveJobRoles = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await this.jobRoleService.getActiveJobRoles(page, limit);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  };

  getExpiredJobRoles = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await this.jobRoleService.getExpiredJobRoles(page, limit);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error)
    }
  };

  searchJobsJobRoles = async (req,res,next)=>{
    try {
       const { q="",location="", page = 1, limit = 10 } = req.query;
       const userId = req.userId
      console.log("serarch query string in controller file==>",q,location)
      const result  = await this.jobRoleService.searchJobRoles(q,location,Number(page),Number(limit),userId)
      console.log("result data ==>",result.data.length)
         res.status(200).json({ 
        success: true, 
        data:result.data,
         pagination: result.pagination
   
      });
    } catch (error) {
      next(error)
    }
  }
}

export default new JobRoleController();
