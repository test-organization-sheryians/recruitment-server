export function safeParseLLMJSON(raw) {
  if (!raw || typeof raw !== "string") {
    throw new Error("No raw text to parse");
  }

  // Remove code fences
  raw = raw.replace(/```(json)?/gi, "").replace(/```/g, "").trim();

  // Find first { or [
  const start = raw.search(/[\[{]/);
  if (start === -1) {
    throw new Error("No JSON object/array found.");
  }

  const jsonPart = raw.slice(start);

  // Detect whether it is array or object
  const opening = jsonPart[0];
  const closing = opening === "{" ? "}" : "]";

  let depth = 0;
  let endIndex = -1;

  for (let i = 0; i < jsonPart.length; i++) {
    const char = jsonPart[i];

    if (char === opening) depth++;
    if (char === closing) depth--;

    if (depth === 0) {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    throw new Error("Could not find end of JSON structure");
  }

  const extracted = jsonPart.slice(0, endIndex + 1);

  try {
    return JSON.parse(extracted);
  } catch (err) {
    // Try to fix common issues
    const cleaned = extracted
      .replace(/,\s*([}\]])/g, "$1")          // Remove trailing commas
      .replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":') // Quote keys
      .replace(/:\s*'([^']*)'/g, ': "$1"');   // Convert single quotes

    return JSON.parse(cleaned);
  }
}
export function normalizeQuestionsArray(parsed) {
  let arr = [];
  if (Array.isArray(parsed)) arr = parsed;
  else if (parsed && Array.isArray(parsed.questions)) arr = parsed.questions;
  else if (parsed && parsed.questions && typeof parsed.questions === "object") {
    arr = [parsed.questions];
  } else {
    throw new Error("Parsed JSON does not contain a questions array");
  }

  return arr.map((q, i) => {
    const id = q.id ?? i + 1;
    const topics =
      Array.isArray(q.topics) && q.topics.length
        ? q.topics
        : typeof q.topics === "string"
        ? q.topics.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

    const constraints = typeof q.constraints === "string" 
      ? q.constraints 
      : Array.isArray(q.constraints) && q.constraints.length
      ? q.constraints.join(", ")
      : "";

    const testCases = Array.isArray(q.testCases) ? q.testCases : [];

    const question = String(q.question ?? q.prompt ?? "");
    const explanation = String(q.explanation ?? "");
    const aiSolution = typeof q.aiSolution === "string" ? q.aiSolution : (q.solution ? String(q.solution) : "");

    return {
      id,
      question,
      topics,
      constraints,
      testCases,
      explanation,
      aiSolution,
    };
  });
}