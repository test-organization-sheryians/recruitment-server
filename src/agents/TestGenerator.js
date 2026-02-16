import { safeParseLLMJSON } from "../lib/cleanCode.js";
import { llm } from "../services/ai.service.js";
import prompt from "../lib/prompt/testGenerator.js";

export async function testGenerator(state) {
  try {
    const skillsList =
  state.skills && state.skills.length > 0
    ? state.skills.join(", ")
    : "None specified";

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

IMPORTANT RULES (STRICT):
- Generate questions ONLY from this category: ${state.category}
- Generate questions ONLY based on the following skills:
  [${skillsList}]
- EACH question must clearly test at least ONE of the listed skills.
- AND MUST explicitly include a "skill" field using one of:
- [${skillsList}].
- If a question does NOT match the category OR skills, DO NOT generate it.
- Questions must be UNIQUE.
- DO NOT reuse any of the following questions:
- ${forbiddenList}

${entropy}

TEST CONFIG:
${JSON.stringify(state, null, 2)}

OUTPUT FORMAT:
Return valid JSON only.
`;

    const res = await llm.invoke(fullPrompt);
    const parsed = safeParseLLMJSON(res.content);
    return parsed;
  } catch (err) {
    console.error("❌ Failed to generate test questions:", err);
    throw err;
  }
}
