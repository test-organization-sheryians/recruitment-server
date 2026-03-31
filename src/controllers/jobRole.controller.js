import JobRoleService from "../services/jobRole.service.js";

class JobRoleController {
  constructor() {
    this.jobRoleService = new JobRoleService();
  }

  createJobRole = async (req, res, next) => {
    try {
      const jobRoleData = {
        ...req.body,
        createdBy: req.userId,
      };

      const jobRole =
        await this.jobRoleService.createJobRole(jobRoleData);

      res.status(201).json({
        success: true,
        message: "Job role created successfully",
        data: jobRole,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllJobRoles = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result =
        await this.jobRoleService.getAllJobRoles(
          req.query,
          req.userId,
          page,
          limit
        );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  getJobRoleById = async (req, res, next) => {
    try {
      const jobRole =
        await this.jobRoleService.getJobRoleById(
          req.params.id,
          req.userId
        );

      res.status(200).json({
        success: true,
        data: jobRole,
      });
    } catch (error) {
      next(error);
    }
  };

  updateJobRole = async (req, res, next) => {
    try {
      const jobRole =
        await this.jobRoleService.updateJobRole(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: "Job role updated successfully",
        data: jobRole,
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
        message: "Job role deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getJobRolesByClient = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result =
        await this.jobRoleService.getJobRolesByClient(
          req.params.clientId,
          page,
          limit
        );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  getJobRolesByCategory = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result =
        await this.jobRoleService.getJobRolesByCategory(
          req.params.categoryId,
          page,
          limit,
          req.userId
        );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  getActiveJobRoles = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result =
        await this.jobRoleService.getActiveJobRoles(
          page,
          limit
        );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  getExpiredJobRoles = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result =
        await this.jobRoleService.getExpiredJobRoles(
          page,
          limit
        );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

searchJobsJobRoles = async (req, res, next) => {
  try {
    let {
      q = "",
      location = "",
      jobType,
      experience,
      minSalary,
      maxSalary,
      category,
      page = 1,
      limit = 10,
    } = req.query;

    page = Math.max(1, Number(page) || 1);
    limit = Math.max(1, Number(limit) || 10);

    const jobTypeArray =
      typeof jobType === "string"
        ? jobType.split(",")
        : Array.isArray(jobType)
        ? jobType
        : [];

    const experienceArray =
      typeof experience === "string"
        ? experience.split(",")
        : Array.isArray(experience)
        ? experience
        : [];

    const cleanedExperienceArray =
      experienceArray.filter(Boolean);

    const result =
      await this.jobRoleService.searchJobRoles(
        q,
        location,
        jobTypeArray,
        cleanedExperienceArray,
        Number(minSalary) || 0,
        Number(maxSalary) || 0,
        category,
        page,
        limit,
        req.userId
      );

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};


  /* 🔥 NEW: CATEGORY → JOB COUNT (Explore by Category) */
  getJobCountByCategory = async (req, res, next) => {
    try {
      const data =
        await this.jobRoleService.getJobCountByCategory();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new JobRoleController();
