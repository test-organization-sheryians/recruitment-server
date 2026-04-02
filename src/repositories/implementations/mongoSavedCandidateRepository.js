import mongoose from "mongoose";
import savedCandidateModel from "../../models/savedCandidate.model.js";
import { AppError } from "../../utils/errors.js";
import ISavedCandidateRepository from "../contracts/ISavedCandidateRepository.js";

class MongoSavedCandidateRepository extends ISavedCandidateRepository {
  //  Helper method to convert string to ObjectId and validate it
  _toObjectId(id, fieldName) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(`Invalid ${fieldName}`, 400);
    }
    return new mongoose.Types.ObjectId(id);
  }

  async saveCandidate(savedBy, candidateId) {
    try {
      const savedById = this._toObjectId(savedBy, "savedBy");
      const candidateObjectId = this._toObjectId(candidateId, "candidateId");

      if (savedById.equals(candidateObjectId)) {
        throw new AppError("You cannot bookmark yourself", 400);
      }

      return await savedCandidateModel.create({
        savedBy: savedById,
        candidateId: candidateObjectId,
      });
    } catch (error) {
     
      if (error.code === 11000) {
        throw new AppError("Candidate already bookmarked", 409);
      }
    
      if (error instanceof AppError) throw error;
    
      throw new AppError("Unable to save candidate", 500);
    }
  }

  async getSavedCandidates(savedBy) {
    try {
      const savedById = this._toObjectId(savedBy, "savedBy");

      const savedCandidates = await savedCandidateModel
        .find({ savedBy: savedById })
        .sort({ createdAt: -1 })
        .populate({
          path: "candidateId",
          select: "firstName lastName email phoneNumber",
        })
        .lean();

      const data = savedCandidates.map((item) => ({
        _id: item._id,
        savedBy: item.savedBy,
        candidateId: item.candidateId?._id || item.candidateId || null,
        createdAt: item.createdAt,
        candidate: item.candidateId
          ? {
              id: item.candidateId._id,
              firstName: item.candidateId.firstName,
              lastName: item.candidateId.lastName,
              email: item.candidateId.email,
              phoneNumber: item.candidateId.phoneNumber,
            }
          : null,
          
      }));

      return { data };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Unable to fetch saved candidates", 500);
    }
  }

  async removeSavedCandidate(savedBy, candidateId) {
    try {
      const deleted = await savedCandidateModel.findOneAndDelete({
        savedBy: this._toObjectId(savedBy, "savedBy"),
        candidateId: this._toObjectId(candidateId, "candidateId"),
      });

      if (!deleted) {
        throw new AppError("Saved candidate not found", 404);
      }

      return deleted;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Unable to remove saved candidate", 500);
    }
  }

  async checkCandidateSavedStatus(savedBy, candidateId) {
    try {
      const doc = await savedCandidateModel.findOne({
        savedBy: this._toObjectId(savedBy, "savedBy"),
        candidateId: this._toObjectId(candidateId, "candidateId"),
      });

      return Boolean(doc);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Unable to check saved candidate status", 500);
    }
  }
}

export default MongoSavedCandidateRepository;
