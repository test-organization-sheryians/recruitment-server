import { safeParseLLMJSON } from '../lib/cleanCode.js';
import { llm } from "../services/ai.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { graph } from "../utils/langgraph.js";
import extractResumePrompt from '../lib/prompt/extractFile.js';

const pdfParse = async (buffer) => {
    const { default: pdf } = await import('pdf-parse/lib/pdf-parse.js');
    return pdf(buffer);
};

export async function generateQuestion(req, res) {
    try {
        let profileData;

        if (req.file) {
            if (req.file.mimetype !== 'application/pdf') {
                return res.status(400).json({
                    success: false,
                    error: "File must be a PDF"
                });
            }

            const pdfBuffer = req.file.buffer;
            const data = await pdfParse(pdfBuffer);
            const extractedText = data.text.replace(/\s+/g, ' ').trim();

            profileData = {
                resumeText: extractedText,
                source: 'pdf',
                metadata: {
                    pageCount: data.numpages,
                    pdfInfo: data.info
                }
            };
        } else if (req.body) {
            profileData = req.body;
        } else {
            return res.status(400).json({
                success: false,
                error: "Either provide a PDF file or JSON profile data"
            });
        }

        const result = await graph.invoke({
            profile: profileData
        }, { startNode: "QuestionGenerator" });
        
        // Check if more information is required
        if (result.requiresMoreInfo) {
            return res.status(400).json({
                success: false,
                requiresMoreInfo: true,
                message: result.message || "More information is required to generate relevant questions."
            });
        }
        
        const response = {
            success: true,
            questions: result.questionsData || result
        };

        if (req.file) {
            response.source = 'pdf';
            response.text = profileData.resumeText;
            response.pageCount = profileData.metadata.pageCount;
        }

        res.json(response);

    } catch (err) {
        console.error('Error in generateQuestion:', err);

        if (err.message.includes('PDF')) {
            return res.status(400).json({
                success: false,
                error: "Invalid PDF file"
            });
        }

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

export const extractResume = asyncHandler(async(req, res) => {
    const {resumeText} = req.body;
    if(!resumeText){
        return res.status(400).json({
            success: false,
            message: 'Resume text is required'
        });
    }

    const prompt = `
${extractResumePrompt.instruction}

${extractResumePrompt.task}

Extraction Rules:
- ${extractResumePrompt.extraction_rules.join('\n- ')}

JSON Schema Example:
${JSON.stringify(extractResumePrompt.json_schema, null, 2)}

Example Output:
${extractResumePrompt.example_output}

Resume Text:
${resumeText}
`;

    const response = await llm.invoke(prompt);

    let data;
    try {
        data = safeParseLLMJSON(response.content);
    } catch (error) {
        data = { error: 'Invalid JSON from AI', raw: response.content };
    }

    res.status(200).json({
        success: true,
        data,
        message: 'Resume extracted, anonymized, and saved to local system',
    });
});
