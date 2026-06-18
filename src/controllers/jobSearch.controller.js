import JobSearchService from "../services/jobSearch.service.js";

class JobSearchController {
  constructor() {
    this.jobSearchService = new JobSearchService();
  }

  search = async (req, res, next) => {
    try {
      const { q } = req.query;
      const titles = await this.jobSearchService.searchJobTitles(q);
      return res.json({ success: true, data: titles });
    } catch (err) {
      next(err);
    }
  };
}

export default new JobSearchController();