import { Router } from "express";
import {
  evaluateAnswers,
  generateQuestion,
  extractResume,
} from "../controllers/ai.controller.js";
import { uploadPDF } from "../middlewares/multer.middleware.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateJWT);


// Route to extract and anonymize resume using AI
router.post("/extract-resume", extractResume);

router.post("/questionset", uploadPDF, generateQuestion);
router.post("/evaluateset", evaluateAnswers);

export default router;
