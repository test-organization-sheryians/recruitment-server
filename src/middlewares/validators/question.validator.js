const validateQuestion = (parsed,state)=>{
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid LLM response: questions array missing");
    }

    if(state.questionType === "MCQ"){
      parsed.questions.forEach((q, index) => {
        if (!q.question || typeof q.question !== "string") {
          throw new Error(`Invalid question at index ${index}: missing question text`);
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Invalid options at index ${index}`);
        }
      });
    }else{
      parsed.questions.forEach((q, index) => {
        if (!q.question || typeof q.question !== "string") {
          throw new Error(`Invalid question at index ${index}: missing question text`);
        }
      });
    }
};

export default validateQuestion;