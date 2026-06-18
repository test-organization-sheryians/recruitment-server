import IJobSearchRepository from "../contracts/IJobSearchRepository.js";
import JobRole from "../../models/jobRole.model.js";

class MongoJobSearchRepository extends IJobSearchRepository {
  async searchByTitle(query) {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const results = await JobRole.find(
      { title: { $regex: escapedQuery, $options: "i" } },
      { title: 1, _id: 0 }
    )
      .limit(7)
      .lean();

    // FIX: pura title nahi — sirf pehle meaningful words return karo
    // "Frontend Developer (Remote, Full-Time) [HRPS]" → "Frontend Developer"
    const cleanTitles = results.map((r) => {
      return r.title
        .replace(/\(.*?\)/g, "")   // () wala part hatao
        .replace(/\[.*?\]/g, "")   // [] wala part hatao
        .replace(/[-–|•,]+$/, "")  // trailing special chars hatao
        .trim();
    });

    // Deduplicate
    return [...new Set(cleanTitles)];
  }
}

export default MongoJobSearchRepository;