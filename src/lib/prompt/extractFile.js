
const extractResumePrompt = {
  instruction:
    "You are an AI assistant that extracts and structures information from resumes/CVs into a clean, standardized JSON format.",
  task: "Extract ALL information from the provided resume/CV text and structure it into a comprehensive JSON format.",
  extraction_rules: [
    "Extract and hide ALL personal information including full name, email, phone, address, and social media profiles",
    "Extract complete education history with degrees, institutions, dates, and academic achievements",
    "Extract detailed work experience including job titles, companies, employment dates, and responsibilities",
    "Extract ALL skills including technical skills, programming languages, tools, and soft skills",
    "Extract projects with descriptions, technologies used, and your role in each project",
    "Extract certifications, licenses, and professional development activities",
    "Extract languages known with proficiency levels",
    "Extract any additional sections like publications, awards, volunteer work, etc.",
    "Preserve all original information exactly as written without summarization or modification"
  ],
  output_rules: [
    "Return ONLY a valid JSON object with no additional text or explanations",
    "Use null for any missing or inapplicable fields",
    "Maintain consistent data types for each field",
    "Preserve all original information without summarization or interpretation",
    "Ensure the output is valid JSON that can be directly parsed"
  ],
  json_schema: {
    education: [
      {
        degree: "string",
        institution: "string",
        field_of_study: "string",
        start_date: "string",
        end_date: "string",
        gpa: "string"
      }
    ],
    experience: [
      {
        job_title: "string",
        company: "string",
        location: "string",
        start_date: "string",
        end_date: "string",
        current: "boolean",
        responsibilities: ["string"]
      }
    ],
    skills: {
      technical_skills: ["string"],
      programming_languages: ["string"],
      tools: ["string"],
      languages: ["string"]
    },
    certifications: [
      {
        name: "string",
        issuer: "string",
        date_issued: "string"
      }
    ],
    projects: [
      {
        name: "string",
        description: "string",
        technologies: ["string"],
        duration: "string"
      }
    ]
  },
  guard_checks: [
    "If the input text is empty or not a resume/CV, return empty object {}",
    "Only include fields that have actual data in the resume",
    "Preserve all original dates and formatting",
    "Maintain the order of items as they appear in the original document"
  ],
  usage_template: `{
  "resume_text": "Paste the extracted text from PDF here"
}`
};


export default extractResumePrompt;
