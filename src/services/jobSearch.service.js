import MongoJobSearchRepository from "../repositories/implementations/MongoJobSearchRepository.js";

class JobSearchService {
  constructor() {
    this.jobSearchRepository = new MongoJobSearchRepository();
  }

  async searchJobTitles(query) {
    if (!query || query.trim().length < 1) return [];
    return await this.jobSearchRepository.searchByTitle(query);
  }
}

export default JobSearchService;