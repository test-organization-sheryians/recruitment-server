import mongoose from "mongoose";
import StudentProfileModel from "../../models/students.profile.js";
import { AppError } from "../../utils/errors.js";
import IStudentsProfileRepository from "../contracts/IStudentsProfileRepository.js";

class MongoStudentsProfile extends IStudentsProfileRepository {
  async createStudentsProfile(studentsData) {
    try {
      const studentsProfile = new StudentProfileModel(studentsData);

      return await studentsProfile.save();
    } catch (error) {
      throw new AppError(
        error.message || "Failed to create students profile",
        500
      );
    }
  }

  async getStudentsProfileById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Student Id", 400);
    }

    return StudentProfileModel.findById(id).lean();
  }

  async getAllStudentsProfile(filter = {}) {
    return StudentProfileModel.find(filter)
      .sort({ updatedAt: -1 })
      .lean();
  }

  async updateStudentsProfile(id, studentsData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Student Id", 400);
    }

    return StudentProfileModel.findByIdAndUpdate(
      id,
      studentsData,
      {
        new: true,
        runValidators: true,
      }
    ).lean();
  }

  async deleteStudentsProfile(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Student Id", 400);
    }

    return StudentProfileModel.findByIdAndDelete(id).lean();
  }
}

export default MongoStudentsProfile;