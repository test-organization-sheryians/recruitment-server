import prompt from "../lib/prompt/questionGenerator.js";
import { llm } from "../services/ai.service.js";
import { safeParseLLMJSON, normalizeQuestionsArray } from "../lib/cleanCode.js";

export async function questionGenerator(state) {
  const profile = state.profile; // now resumeText only from frontend

  const fullPrompt = `${JSON.stringify(prompt)}

CANDIDATE PROFILE DATA:
${JSON.stringify(profile, null, 2)}

Based on the above candidate profile, first validate if you have sufficient information, 
then generate exactly 6 programming questions following the specified rules.`;

  // LLM CALL
  const res = await llm.invoke(fullPrompt);

  const text =
    typeof res === "string"
      ? res
      : res?.content
      ? res.content
      : JSON.stringify(res);

  try {
    const parsed = safeParseLLMJSON(text);

    // Case: LLM says not enough info
    if (parsed.requiresMoreInfo) {
      return {
        requiresMoreInfo: true,
        message:
          parsed.message ||
          "More information is required to generate relevant questions.",
        questionsData: null,
      };
    }

    // Case: LLM returned proper JSON with questions
    if (parsed.questions) {
      const questionsData = normalizeQuestionsArray(parsed);

      if (questionsData.length !== 6) {
        console.warn(
          `Expected 6 questions but parsed ${questionsData.length}.`
        );
      }

      return { questionsData, requiresMoreInfo: false };
    }

    // Fallback if the format is off: Try normalization
    const questionsData = normalizeQuestionsArray(parsed);
    return { questionsData, requiresMoreInfo: false };

  } catch (err) {
    console.error("Failed to parse LLM response as JSON:", err);
    throw err;
  }
}
