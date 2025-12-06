import { safeParseLLMJSON } from "../lib/cleanCode.js";
import { llm } from "../services/ai.service.js";
import prompt from "../lib/prompt/testGenerator.js";

export async function testGenerator(state) {
  try {

    const fullPrompt = `${prompt} 
    TEST CONFIG:
    ${JSON.stringify(state, null, 2)}`

    const res = await llm.invoke(fullPrompt);
    console.log(res);

    const parsed = safeParseLLMJSON(res.content);
    return parsed;

  } catch (err) {
    console.error("❌ Failed to generate test questions:", err);
    throw err;
  }
}
