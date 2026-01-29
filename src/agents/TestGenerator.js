import { safeParseLLMJSON } from "../lib/cleanCode.js";
import { llm } from "../services/ai.service.js";
import prompt from "../lib/prompt/testGenerator.js";

export async function testGenerator(state) {
  try {
    const entropy = `
    USER_ENTROPY:
    - userSeed: ${state.userSeed}
    - timestamp: ${Date.now()}
    - random: ${Math.random()}
    `;
    const forbiddenList =
      state.excludeQuestions && state.excludeQuestions.length > 0
        ? state.excludeQuestions.join("\n- ")
        : "None";
const fullPrompt = `
${prompt}

IMPORTANT RULES:
- Generate questions ONLY from this category: ${state.category}
- If a question does NOT belong to this category, DO NOT generate it.
- Questions must be UNIQUE.
- DO NOT use any of the following questions that have already been assigned:
- ${forbiddenList}

${entropy}

TEST CONFIG:
${JSON.stringify(state, null, 2)}
`;


    const res = await llm.invoke(fullPrompt);
    const parsed = safeParseLLMJSON(res.content);
    return parsed;
  } catch (err) {
    console.error("❌ Failed to generate test questions:", err);
    throw err;
  }
}
