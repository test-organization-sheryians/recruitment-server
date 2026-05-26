import MongoStudentsProfile from "../repositories/implementations/mongoStudentsProfileRepository.js";
import { AppError } from "../utils/errors.js";

class StudentService {
  constructor() {
    this.studentsRepository = new MongoStudentsProfile();
  }

  _assertOwner(studentsProfile, userId) {
    if (!studentsProfile) return;

    const ownerId =
      studentsProfile.createdBy?._id ?? studentsProfile.createdBy;

    if (!ownerId || ownerId.toString() !== userId.toString()) {
      throw new AppError(
        "You do not have permission to access this profile",
        403
      );
    }
  }

  async createStudentsProfile(studentsData, userId) {
    const student = await this.studentsRepository.createStudentsProfile({
      ...studentsData,
      createdBy: userId,
    });

    if (!student) {
      throw new AppError("Failed to create student profile", 500);
    }

    return student;
  }

  async getAllStudentsProfile(userId) {
    return this.studentsRepository.getAllStudentsProfile({
      createdBy: userId,
    });
  }

  async getStudentsProfileById(id, userId) {
    const student =
      await this.studentsRepository.getStudentsProfileById(id);

    if (!student) {
      throw new AppError("Student profile not found", 404);
    }

    this._assertOwner(student, userId);

    return student;
  }

  async updateStudentsProfile(id, studentsData, userId) {
    const existing =
      await this.studentsRepository.getStudentsProfileById(id);

    if (!existing) {
      throw new AppError("Student profile not found", 404);
    }

    this._assertOwner(existing, userId);

    const updated =
      await this.studentsRepository.updateStudentsProfile(
        id,
        studentsData
      );

    if (!updated) {
      throw new AppError(
        "Student profile not found or update failed",
        404
      );
    }

    return updated;
  }

  async deleteStudentsProfile(id, userId) {
    const existing =
      await this.studentsRepository.getStudentsProfileById(id);

    if (!existing) {
      throw new AppError("Student profile not found", 404);
    }

    this._assertOwner(existing, userId);

    const deleted =
      await this.studentsRepository.deleteStudentsProfile(id);

    if (!deleted) {
      throw new AppError(
        "Student profile not found or delete failed",
        404
      );
    }

    return deleted;
  }
}

export default new StudentService();