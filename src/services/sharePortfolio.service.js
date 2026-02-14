import MongoSharePortfolioRepository from "../repositories/implementations/mongoSharePortfolio.js";

class SharePortfolioService {
  constructor() {
    this.sharePortfolioRepository = new MongoSharePortfolioRepository();
  }

  async createSharePortfolio(freelancers) {
    return await this.sharePortfolioRepository.createPortfolio(freelancers);
  }

  async getSharedPortfolio(shareId) {
    return await this.sharePortfolioRepository.getSharedPortfolio(shareId);
  }
}

export default SharePortfolioService;
