const formatList = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "general role-relevant technologies";
  }

  return items.filter(Boolean).join(", ");
};

export const buildAnswerEvaluationPrompt = ({
  role,
  company,
  difficulty,
  techStack,
  interviewType,
  question,
  expectedAnswer,
  answer,
}) => {
  return `
You are an expert interview evaluator.

Evaluate the candidate answer for this interview context:
- Role: ${role}
- Company: ${company || "Not specified"}
- Difficulty: ${difficulty || "medium"}
- Tech stack: ${formatList(techStack)}
- Interview type: ${interviewType || "technical"}

Question:
${question}

Reference answer / evaluation guidance:
${expectedAnswer || "No reference answer was provided. Evaluate against practical industry expectations."}

Candidate answer:
${answer}

Return only valid JSON. Do not include markdown, comments, prose, or code fences.

The JSON must match this exact shape:
{
  "score": 0,
  "feedback": [
    "string"
  ],
  "rubric": {
    "correctness": 0,
    "communication": 0,
    "depth": 0,
    "tradeoffs": 0,
    "codeQuality": 0
  }
}

Rules:

- Return ONLY valid JSON.
- Do NOT include markdown, code fences, explanations, or extra text.
- All scores MUST be integers between 0 and 100.
- Never use decimals.
- Never use percentages (%).
- Never use strings for score values.
- "score" must represent the overall answer quality.
- "correctness" measures technical accuracy and correctness.
- "communication" measures clarity, structure, and conciseness.
- "depth" measures completeness, reasoning, complexity analysis, and technical insight.
- "tradeoffs" measures awareness of alternatives, constraints, pros/cons, and practical implications.
- "codeQuality" measures efficiency, readability, maintainability, and use of best practices. If no code is provided, evaluate engineering rigor instead.
- "feedback" must be specific, actionable, and concise.
- feedback must be an array containing 3 to 5 strings.
- Each feedback string must be under 25 words.
- Do not praise without justification.
- Mention at least one strength and one improvement area.
- If the answer is incorrect, clearly explain the main mistake.
- If the answer is correct but suboptimal, explain the better approach.
- Ensure rubric scores are consistent with the overall score.
- The overall score should approximately reflect the average quality across all rubric categories.
`.trim();
};
