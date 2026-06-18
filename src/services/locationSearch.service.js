import MongoLocationSearchRepository from "../repositories/implementations/mongoLocationSearchRepository.js";

class LocationSearchService {
  constructor() {
    this.locationSearchRepository = new MongoLocationSearchRepository();
  }

  async searchLocations(query) {
    if (!query || query.trim().length < 1) return [];
    return await this.locationSearchRepository.searchByLocation(query);
  }
}

export default LocationSearchService;