const formatList = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "general role-relevant technologies";
  }

  return items.filter(Boolean).join(", ");
};

export const buildTechnicalInterviewQuestionsPrompt = ({
  role,
  company,
  difficulty,
  techStack,
  interviewType,
  questionCount = 5,
}) => {
  return `
You are an expert technical interviewer.

Generate exactly ${questionCount} interview questions for this interview:
- Role: ${role}
- Company: ${company || "Not specified"}
- Difficulty: ${difficulty || "medium"}
- Tech stack: ${formatList(techStack)}
- Interview type: ${interviewType || "technical"}

Return only valid JSON. Do not include markdown, comments, prose, or code fences.

The JSON must match this exact shape:
{
  "questions": [
    {
      "question": "string",
      "category": "technical",
      "expectedAnswer": "string",
      "difficulty": "${difficulty || "medium"}"
    }
  ]
}

Rules:
- Include exactly ${questionCount} items in "questions".
- Make questions practical, role-specific, and appropriate for the requested difficulty.
- Use one of these category values only: technical, behavioral, system-design, coding, hr, other.
- Use one of these difficulty values only: easy, medium, hard.
- Keep each question under 2000 characters.
- Keep each expectedAnswer under 5000 characters.
`.trim();
};
