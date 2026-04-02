import express from "express";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import savedCandidateController from "../controllers/savedCandidate.controller.js";

const router = express.Router();

router.post(
  "/:candidateId",
  authenticateJWT,
  authorize("client"),
  savedCandidateController.saveCandidate,
);

router.get(
  "/",
  authenticateJWT,
  authorize("client"),
  savedCandidateController.getSavedCandidates,
);

router.get(
  "/:candidateId/status",
  authenticateJWT,
  authorize("client"),
  savedCandidateController.getSavedCandidateStatus,
);

router.delete(
  "/:candidateId",
  authenticateJWT,
  authorize("client"),
  savedCandidateController.removeSavedCandidate,
);

export default router;
