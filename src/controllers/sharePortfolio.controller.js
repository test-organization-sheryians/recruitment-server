import SharePortfolioService from "../services/sharePortfolio.service.js";

class SharePortfolioController {
  constructor() {
    this.sharePortfolioService = new SharePortfolioService();
  }

  createSharePortfolio = async (req, res, next) => {
    try {
      const { freelancers } = req.body; // Array of userIds
      const shareLink =
        await this.sharePortfolioService.createSharePortfolio(freelancers);

      res.status(201).json({
        message: "Portfolio share link created",
        shareLink: shareLink,
      });
    } catch (error) {
      next(error);
    }
  };

  getSharedPortfolio = async (req, res, next) => {
    try {
      const { shareId } = req.params;
      const response =
        await this.sharePortfolioService.getSharedPortfolio(shareId);

      res.status(200).json({
        message: "Shared portfolios fetched successfully",
        count: response.count,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default SharePortfolioController;
