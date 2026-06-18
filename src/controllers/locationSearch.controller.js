import LocationSearchService from "../services/locationSearch.service.js";

class LocationSearchController {
  constructor() {
    this.locationSearchService = new LocationSearchService();
  }

  search = async (req, res, next) => {
    try {
      const { q } = req.query;
      const locations = await this.locationSearchService.searchLocations(q);
      return res.json({ success: true, data: locations });
    } catch (err) {
      next(err);
    }
  };
}

export default new LocationSearchController();