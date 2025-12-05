import { llm } from "../services/ai.service.js";

export async function testGenerator(state) {
    const  promptt  = state.promptt
    console.log("prompt--->",promptt);

    // const prompt = "what is capital of india"
  const fullPrompt = `${JSON.stringify(promptt)}`
  console.log(fullPrompt);
  


    const res = await llm.invoke(fullPrompt)

    console.log(res);
}