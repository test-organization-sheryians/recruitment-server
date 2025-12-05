import { graph } from "../utils/langgraph.js";

const pdfParse = async (buffer) => {
    const { default: pdf } = await import('pdf-parse/lib/pdf-parse.js');
    return pdf(buffer);
  
};

export async function generateQuestion(req, res) {
    try {
        // Only parsed text is accepted now
        if (!req.body || !req.body.resumeText) {
            return res.status(400).json({
                success: false,
                error: "resumeText is required in request body"
            });
        }

        const profileData = {
            resumeText: req.body.resumeText,
            source: 'text'
        };
        
        const result = await graph.invoke(
            { profile: profileData },
            { startNode: "QuestionGenerator" }
        );

        if (result.requiresMoreInfo) {
            return res.status(400).json({
                success: false,
                requiresMoreInfo: true,
                message: result.message || "More information is required to generate relevant questions."
            });
        }


        res.json({
            success: true,
            questions: result.questionsData || result
        });

    } catch (err) {
        console.error('Error in generateQuestion:', err);

        res.status(500).json({
            success: false,
            error: "Error generating questions",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}


export async function evaluateAnswers(req, res) {
    try {
        const { questions, answers } = req.body;

        if (!questions || !Array.isArray(questions)) {
            return res.status(400).json({
                success: false,
                error: "Questions array is required"
            });
        }

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                error: "Answers array is required"
            });
        }

        const { answerEvaluator } = await import('../agents/AnswerEvaluator.js');

        const result = await answerEvaluator({
            questions,
            answers
        });

        res.json({
            success: true,
            evaluations: result.evaluations,
            total: result.total
        });
    } catch (err) {
        console.error('Error in evaluateAnswers:', err);
        res.status(500).json({
            success: false,
            error: "Error evaluating answers",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}