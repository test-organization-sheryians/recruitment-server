import savedCandidateService from "../services/savedCandidate.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class SavedCandidateController {
  saveCandidate = asyncHandler(async (req, res) => {
    const { candidateId } = req.params;
    const savedBy = req.userId;

    const saved = await savedCandidateService.saveCandidate(savedBy, candidateId);

    res.status(201).json({
      success: true,
      message: "Candidate bookmarked successfully",
      data: saved,
    });
  });

  getSavedCandidates = asyncHandler(async (req, res) => {
    const savedBy = req.userId;
 
    const result = await savedCandidateService.getSavedCandidates(
      savedBy,
    );

    res.status(200).json({
      success: true,
      data: result.data,
    });
  });

  removeSavedCandidate = asyncHandler(async (req, res) => {
    const { candidateId } = req.params;
    const savedBy = req.userId;

    await savedCandidateService.removeSavedCandidate(savedBy, candidateId);

    res.status(200).json({
      success: true,
      message: "Saved candidate removed successfully",
    });
  });

  getSavedCandidateStatus = asyncHandler(async (req, res) => {
    const { candidateId } = req.params;
    const savedBy = req.userId;
    

    const status = await savedCandidateService.checkCandidateSavedStatus(
      savedBy,
      candidateId
    );

    res.status(200).json({
      success: true,
      data: status,
    });
  });
}

export default new SavedCandidateController();
