import ILocationSearchRepository from "../contracts/ILocationSearchRepository.js";
import JobRole from "../../models/jobRole.model.js";

class MongoLocationSearchRepository extends ILocationSearchRepository {
  async searchByLocation(query) {
    const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const results = await JobRole.find(
      {
        $or: [
          { "location.city": { $regex: escapedQuery, $options: "i" } },
          { "location.state": { $regex: escapedQuery, $options: "i" } },
        ],
      },
      { "location.city": 1, "location.state": 1, _id: 0 }
    )
      .limit(7)
      .lean();

    // "Mumbai, Maharashtra" format
    const formatted = results
      .filter((r) => r.location?.city)
      .map((r) => {
        const city = r.location.city?.trim() || "";
        const state = r.location.state?.trim() || "";
        return state ? `${city}, ${state}` : city;
      });

    // Deduplicate
    return [...new Set(formatted)];
  }
}

export default MongoLocationSearchRepository;