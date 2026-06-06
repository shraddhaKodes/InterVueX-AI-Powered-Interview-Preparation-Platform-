export const resumeAnalysisPrompt = (resumeText) => {
  return `
You are an expert ATS (Applicant Tracking System) resume analyzer.

Analyze the resume text below and produce ONLY valid JSON.

Return only this exact JSON shape (no markdown, no code fences):
{
  "ATSScore": 0,
  "extractedSkills": [],
  "missingSkills": [],
  "suggestedImprovements": [],
  "feedback": {
    "summary": "",
    "sections": [],
    "keywordMatches": []
  }
}

Rules / validation constraints:
- ATSScore must be an integer between 0 and 100.
- extractedSkills must be an array of strings.
- missingSkills must be an array of strings.
- suggestedImprovements must be an array of strings.
- feedback.summary is required (string).
- feedback.sections must be an array of strings.
- feedback.keywordMatches must be an array of strings.

Interpretation guidance:
- extractedSkills: skills/keywords you can clearly find in the resume.
- missingSkills: important skills/keywords that are typical for ATS screening but not found or not clearly evidenced in the resume.
- suggestedImprovements: practical, ATS-focused improvements (formatting, keyword coverage, section completeness, clarity).
- feedback.summary: 2-4 sentences describing strengths and the biggest ATS gap.
- feedback.sections: list the resume sections that are strong or weak (e.g. "Skills section is weak", "Experience section is detailed").
- feedback.keywordMatches: pick key ATS-relevant keywords that were matched, as exact/near-exact strings from the resume.

Resume text:
${resumeText}
`.trim();
};
