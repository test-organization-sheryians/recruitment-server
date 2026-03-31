import testAttempt from "../models/TestAttempt.js";
import TestEnrollments from "../models/TestEnrollments.js";

export const logViolation = async (req, res) => {
  try {
    const { attemptId, switchCount } = req.body;
    const userId = req.userId;

    const attempt = await testAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        message: "Test Attempt not Found!",
      });
    }

    if (attempt.email !== req.user.email) {
      return res.status(403).json({
        message:
          "Unauthorized: You do not have permission to update this test.",
      });
    }
    if (attempt.status === "Disqualified") {
      return res.status(403).json({
        message: "Attempt already disqualified",    
      });
    }

    attempt.tabSwitches += 1;

    if (attempt.tabSwitches >= 3) {
      attempt.isDisqualified = true;
      attempt.status = "Disqualified";
      
      await TestEnrollments.updateOne(
        { testId: attempt.testId, email: attempt.email },
        { status: "Disqualified" }
      );
    }

    await attempt.save();

    res.status(200).json({
      success: true,
      tabSwitches: attempt.tabSwitches,
      disqualified: attempt.isDisqualified,
    });
  } catch (err) {
    console.error("Violation error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
