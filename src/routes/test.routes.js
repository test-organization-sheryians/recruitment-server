import express from "express";
import testController from "../controllers/tests.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticateJWT,
  testController.createTest.bind(testController)
);
router.get(
  "/published/all",
  testController.getPublishedTests.bind(testController)
);
router.get("/:testId", testController.getTest.bind(testController));

router.patch(
  "/:testId",
  authenticateJWT,
  testController.updateTest.bind(testController)
);

export default router;
