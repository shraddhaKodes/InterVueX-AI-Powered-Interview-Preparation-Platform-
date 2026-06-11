import { Interview } from "../models/InterviewSchema.js";
import { ResumeAnalysis } from "../models/ResumeAnalysisSchema.js";
import { CodingSubmission } from "../models/CodingSubmissionSchema.js";

// Existing dashboard analytics uses AnalyticsSchema in this same file.
// We extend this file without removing existing exports.
import { Analytics } from "../models/AnalyticsSchema.js";

const clamp01 = (n) => Math.max(0, Math.min(1, n));

export const getDashboardAnalyticsService = async (userId) => {
  return await Analytics.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId } },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  );
};

export const updateAnalyticsService = async (userId, payload) => {
  const updateFields = {};

  ["totalInterviews", "totalCodingProblems", "averageScore", "streak"].forEach(
    (field) => {
      if (payload[field] !== undefined) {
        updateFields[field] = payload[field];
      }
    },
  );

  const update = {
    ...(Object.keys(updateFields).length ? { $set: updateFields } : {}),
    ...(payload.activityLog
      ? {
          $push: {
            activityLogs: {
              $each: [payload.activityLog],
              $slice: -100,
            },
          },
        }
      : {}),
  };

  if (!Object.keys(update).length) {
    return await getDashboardAnalyticsService(userId);
  }

  return await Analytics.findOneAndUpdate({ user: userId }, update, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
};

// Helper used by AI service
export const interviewToText = (overview) => {
  return JSON.stringify(overview, null, 2);
};

const toSafeNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const buildTrend = (points) => {
  // points: [{ date, value }]
  return points;
};

export const getAnalyticsOverviewService = async (userId) => {
  // Interview aggregates
  const interviewDocs = await Interview.find({ user: userId }).select(
    "score createdAt",
  );
  const totalInterviews = interviewDocs.length;
  const avgInterviewScore = totalInterviews
    ? interviewDocs.reduce((acc, d) => acc + toSafeNum(d.score), 0) /
      totalInterviews
    : 0;

  // Resume aggregates (latest by createdAt)
  const resumeLatest = await ResumeAnalysis.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(1);
  const resumeDoc = resumeLatest[0];
  const atsScore = toSafeNum(resumeDoc?.ATSScore, 0);

  // Coding aggregates
  const codingDocs = await CodingSubmission.find({ user: userId }).select(
    "score verdict createdAt",
  );
  const totalSubmissions = codingDocs.length;
  const avgCodingScore = totalSubmissions
    ? codingDocs.reduce((acc, d) => acc + toSafeNum(d.score), 0) /
      totalSubmissions
    : 0;

  // Basic trends by day (lightweight)
  const dayKey = (ts) => {
    const d = new Date(ts);
    return d.toISOString().slice(0, 10);
  };

  const interviewByDay = new Map();
  for (const d of interviewDocs) {
    const k = dayKey(d.createdAt);
    const prev = interviewByDay.get(k) || { sum: 0, count: 0 };
    prev.sum += toSafeNum(d.score);
    prev.count += 1;
    interviewByDay.set(k, prev);
  }

  const codingByDay = new Map();
  for (const d of codingDocs) {
    const k = dayKey(d.createdAt);
    const prev = codingByDay.get(k) || { sum: 0, count: 0 };
    prev.sum += toSafeNum(d.score);
    prev.count += 1;
    codingByDay.set(k, prev);
  }

  const interviewTrend = [...interviewByDay.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .slice(-14)
    .map(([date, { sum, count }]) => ({
      name: date,
      score: count ? Math.round(sum / count) : 0,
    }));

  const codingTrend = [...codingByDay.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .slice(-14)
    .map(([date, { sum, count }]) => ({
      name: date,
      score: count ? Math.round(sum / count) : 0,
    }));

  return {
    interview: {
      totalInterviews,
      avgScore: Math.round(avgInterviewScore * 10) / 10,
      scoreTrend: buildTrend(interviewTrend),
    },
    resume: {
      resumeCount: await ResumeAnalysis.countDocuments({ user: userId }),
      atsScore: Math.round(atsScore * 10) / 10,
    },
    coding: {
      totalSubmissions,
      avgScore: Math.round(avgCodingScore * 10) / 10,
      verdictCounts: codingDocs.reduce((acc, d) => {
        const v = d.verdict || "pending";
        acc[v] = (acc[v] || 0) + 1;
        return acc;
      }, {}),
      scoreTrend: buildTrend(codingTrend),
    },
  };
};

export const getInterviewAnalyticsService = async (userId) => {
  const docs = await Interview.find({ user: userId }).select(
    "score difficulty techStack createdAt",
  );

  const total = docs.length;
  const avg = total
    ? docs.reduce((a, d) => a + toSafeNum(d.score), 0) / total
    : 0;

  const byDifficulty = ["easy", "medium", "hard"].map((diff) => {
    const items = docs.filter((d) => d.difficulty === diff);
    const s = items.length
      ? items.reduce((a, d) => a + toSafeNum(d.score), 0) / items.length
      : 0;
    return { difficulty: diff, count: items.length, score: Math.round(s) };
  });

  // strengths: top 5 techStack occurrences
  const stackCount = new Map();
  docs.forEach((d) => {
    (d.techStack || []).forEach((t) => {
      stackCount.set(t, (stackCount.get(t) || 0) + 1);
    });
  });

  const topStacks = [...stackCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([topic, count]) => ({ topic, count }));

  return {
    totalInterviews: total,
    avgScore: Math.round(avg * 10) / 10,
    byDifficulty,
    topStacks,
  };
};

export const getResumeAnalyticsService = async (userId) => {
  const docs = await ResumeAnalysis.find({ user: userId }).sort({
    createdAt: -1,
  });
  const latest = docs[0];

  const atsScore = toSafeNum(latest?.ATSScore, 0);

  const extractedSkills = (latest?.extractedSkills || []).slice(0, 12);
  const missingSkills = (latest?.missingSkills || []).slice(0, 12);

  // very lightweight trend: last 10 ATS scores
  const trend = docs
    .slice(0, 10)
    .reverse()
    .map((d) => ({
      name: d.createdAt.toISOString().slice(0, 10),
      score: toSafeNum(d.ATSScore, 0),
    }));

  return {
    atsScore: Math.round(atsScore * 10) / 10,
    extractedSkills,
    missingSkills,
    atsTrend: trend,
  };
};

export const getCodingAnalyticsService = async (userId) => {
  const docs = await CodingSubmission.find({ user: userId }).select(
    "score verdict language problem createdAt",
  );
  const total = docs.length;
  const avg = total
    ? docs.reduce((a, d) => a + toSafeNum(d.score), 0) / total
    : 0;

  const verdictCounts = docs.reduce((acc, d) => {
    const v = d.verdict || "pending";
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {});

  const languageCounts = docs.reduce((acc, d) => {
    const lang = d.language || "other";
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {});

  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([language, count]) => ({ language, count }));

  const weakVerdict = Object.entries(verdictCounts)
    .sort((a, b) => a[1] - b[1])
    .shift();

  return {
    totalSubmissions: total,
    avgScore: Math.round(avg * 10) / 10,
    verdictCounts,
    topLanguages,
    weakestVerdict: weakVerdict?.[0] || null,
  };
};

export const getRecommendationsService = async (userId, aiInsights) => {
  // If aiInsights has nextSteps, just return.
  const nextSteps = aiInsights?.nextSteps || [];
  return {
    careerReadinessScore: aiInsights?.careerReadinessScore ?? 0,
    strengths: aiInsights?.strengths || [],
    weaknesses: aiInsights?.weaknesses || [],
    nextSteps,
    confidenceNotes: aiInsights?.confidenceNotes || "",
  };
};
