import { generateResumeAnalysisRaw } from "./aiService.js";

const safeParseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const isPlainObject = (v) =>
  !!v && typeof v === "object" && !Array.isArray(v);

const normalizeInsights = (raw) => {
  const obj = isPlainObject(raw) ? raw : {};

  const careerReadinessScore = (() => {
    const n = Number(obj.careerReadinessScore);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
  })();

  const toStringArray = (v) =>
    Array.isArray(v)
      ? v
          .map((x) => (typeof x === "string" ? x.trim() : ""))
          .filter(Boolean)
          .slice(0, 10)
      : [];

  return {
    careerReadinessScore,

    strengths: toStringArray(obj.strengths),

    weaknesses: toStringArray(obj.weaknesses),

    nextSteps: toStringArray(obj.nextSteps),

    confidenceNotes:
      typeof obj.confidenceNotes === "string"
        ? obj.confidenceNotes
        : "",

    jobReadinessLevel:
      typeof obj.jobReadinessLevel === "string"
        ? obj.jobReadinessLevel
        : "Beginner",

    priorityTopics: toStringArray(obj.priorityTopics),

    improvementAreas: toStringArray(obj.improvementAreas),
  };
};

export const generateAiAnalyticsInsights = async ({
  user,
  overview,
  interview,
  resume,
  coding,
}) => {
  try {
    const analyticsData = {
      overview,
      interview,
      resume,
      coding,
    };

    const prompt = {
      system: `
You are an expert FAANG interview coach, recruiter, resume reviewer,
and software engineering mentor.

Analyze:
1. Interview performance
2. Resume quality
3. Coding performance

Return ONLY valid JSON.

No markdown.
No explanation.
No code blocks.
No extra text.
`,

      user: `
Analyze the analytics data.

Return exactly:

{
  "careerReadinessScore": number,
  "jobReadinessLevel": string,
  "strengths": [],
  "weaknesses": [],
  "priorityTopics": [],
  "improvementAreas": [],
  "nextSteps": [],
  "confidenceNotes": ""
}

Rules:

- Use actual evidence from analytics.
- Mention ATS issues if present.
- Mention coding weaknesses if present.
- Mention interview weaknesses if present.
- Give actionable next steps.
- Score should be 0-100.
- Job readiness should be one of:
  Beginner,
  Intermediate,
  Interview Ready,
  Placement Ready,
  Industry Ready
`,
      context: analyticsData,
    };

    const raw = await generateResumeAnalysisRaw(
      JSON.stringify(prompt),
      "generate analytics insights",
    );

    console.log("========== AI RAW RESPONSE ==========");
    console.log(raw);

    const parsed = safeParseJson(raw);

    if (parsed) {
      return {
        version: "v1",
        ...normalizeInsights(parsed),
      };
    }

    console.warn("AI returned invalid JSON.");
  } catch (error) {
    console.error(
      "AI Analytics Generation Failed:",
      error,
    );
  }

  // ---------------------------------
  // Fallback Logic
  // ---------------------------------

  const interviewAvg =
    overview?.interview?.avgScore ?? 0;

  const resumeATS =
    overview?.resume?.atsScore ?? 0;

  const codingAvg =
    overview?.coding?.avgScore ?? 0;

  let readiness =
    interviewAvg * 0.4 +
    codingAvg * 0.35 +
    resumeATS * 0.25;

  if (interviewAvg < 50)
    readiness -= 5;

  if (resumeATS < 60)
    readiness -= 5;

  if (codingAvg < 50)
    readiness -= 5;

  readiness = Math.max(
    0,
    Math.min(100, Math.round(readiness)),
  );

  const strengths = [];
  const weaknesses = [];
  const priorityTopics = [];
  const improvementAreas = [];

  if (resumeATS >= 75)
    strengths.push(
      "Resume meets ATS standards",
    );
  else {
    weaknesses.push(
      "Resume requires ATS optimization",
    );

    priorityTopics.push(
      "Resume Keyword Optimization",
    );
  }

  if (codingAvg >= 70)
    strengths.push(
      "Reliable coding execution",
    );
  else {
    weaknesses.push(
      "Coding accuracy needs improvement",
    );

    improvementAreas.push(
      "Problem Solving",
    );
  }

  if (interviewAvg >= 70)
    strengths.push(
      "Strong interview performance",
    );
  else {
    weaknesses.push(
      "Improve interview responses and depth",
    );

    improvementAreas.push(
      "Interview Communication",
    );
  }

  let jobReadinessLevel = "Beginner";

  if (readiness >= 85)
    jobReadinessLevel = "Industry Ready";
  else if (readiness >= 75)
    jobReadinessLevel = "Placement Ready";
  else if (readiness >= 65)
    jobReadinessLevel = "Interview Ready";
  else if (readiness >= 50)
    jobReadinessLevel = "Intermediate";

  return {
    version: "v1",

    careerReadinessScore: readiness,

    jobReadinessLevel,

    strengths,

    weaknesses,

    priorityTopics,

    improvementAreas,

    nextSteps: [
      "Practice 2 mock interviews per week",
      "Solve 3 coding problems daily",
      "Improve resume keywords based on ATS analysis",
      "Focus on system design and backend concepts",
    ],

    confidenceNotes:
      "Generated using fallback analytics because AI response was unavailable or invalid.",
  };
};