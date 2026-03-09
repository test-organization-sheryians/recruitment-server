import ICertificateRepository from "../contracts/ICertificateRepository.js";
import Certificate from "../../models/certificate.model.js";
import mongoose from "mongoose";

class MongoCertificateRepository extends ICertificateRepository {
  async create(data) {
    try {
      const certificateData = new Certificate(data);
      return await certificateData.save();
    } catch (err) {
      if (err.code === 11000) {
        throw { status: 400, message: "Failed to create certificate" };
      }
      throw err;
    }
  }

  async findByName(name) {
    const result = await Certificate.aggregate([
      { $match: { name } },
      { $limit: 1 },
    ]);
    return result[0] || null;
  }

  async findById(id) {
    const result = await Certificate.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $limit: 1 },
    ]);
    return result[0] || null;
  }

  async findAll() {
    try {
      const pipeline = [
        {
          $match: {}
        },
        {
          $lookup: {
            from: "jobapplicationquestions",
            let: { certificateId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$jobId", "$$certificateId"]
                  }
                }
              },
              {
                $project: {
                  questions: 1,
                  _id: 0
                }
              }
            ],
            as: "questions"
          }
        },
        {
          $addFields: {
            questions: {
              $cond: {
                if: { $gt: [{ $size: "$questions" }, 0] },
                then: { $arrayElemAt: ["$questions.questions", 0] },
                else: []
              }
            }
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ];

      return await Certificate.aggregate(pipeline);
    } catch (error) {
      console.error(error);
      throw new AppError("Failed to fetch certificates", 500);
    }
  }

  async update(id, updateData) {
    try {
      const updated = await Certificate.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      return updated;
    } catch (err) {
      if (err.code === 11000) {
        throw { status: 400, message: "Cretificate name already exists" };
      }
      throw err;
    }
  }

  async delete(id) {
    return await Certificate.findByIdAndDelete(id);
  }
}

export default MongoCertificateRepository;
