import { llm } from "../services/ai.service.js";
import { safeParseLLMJSON } from "../controllers/lib/cleanCode.js";
import evaluationPrompt from "../controllers/lib/prompt/answerEvaluatorPrompt.js";

export async function evaluateTest({
  questions,
  answers,
  passingScore,
  testPrompt,
}) {
  const prompt = `${evaluationPrompt}

QUESTIONS:
${JSON.stringify(questions, null, 2)}

ANSWERS:
${JSON.stringify(answers, null, 2)}

PROMPT:
${JSON.stringify(testPrompt, null, 2)}

`;

  const aiResponse = await llm.invoke(prompt);
  const parsed = safeParseLLMJSON(aiResponse.content) || {};

  let { results = [] } = parsed;

  if (!Array.isArray(results)) results = [];

  const computedScore = results.reduce((sum, r, index) => {
    // Get maxMarks from result or the original question bank
    const maxAllowed = r.maxMarks || questions[index]?.maxMarks || 10;

    // Clamp the score: 0 <= score <= maxAllowed
    const rawScore = typeof r.score === "number" ? r.score : 0;
    const clampedScore = Math.min(Math.max(0, rawScore), maxAllowed);

    // Force the result object to show the corrected data
    r.score = clampedScore;
    r.maxMarks = maxAllowed;

    return sum + clampedScore;
  }, 0);

  const maxTotalMarks = results.reduce((sum, r, index) => {
    return sum + (r.maxMarks || questions[index]?.maxMarks || 10);
  }, 0);

  let computedPercentage =
    maxTotalMarks > 0 ? (computedScore / maxTotalMarks) * 100 : 0;

  const totalQuestions =
    results.length ||
    (Array.isArray(questions) ? questions.length : 0) ||
    (Array.isArray(answers) ? answers.length : 0);

  let computedPassed =
    typeof passed === "boolean"
      ? passed
      : typeof passingScore === "number"
      ? computedPercentage >= passingScore
      : false;

  return {
    totalScore: computedScore,
    maxTotalMarks: maxTotalMarks,
    percentage: Number(computedPercentage.toFixed(2)),
    passed: computedPassed,
    results,
  };
}
