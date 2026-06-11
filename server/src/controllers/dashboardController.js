import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";

import {
  getAnalyticsOverviewService,
  getInterviewAnalyticsService,
  getResumeAnalyticsService,
  getCodingAnalyticsService,
  getRecommendationsService,
} from "../services/analyticsService.js";

const makeOverview = (user) => ({
  userSummary: {
    name: user.fullName || "Candidate",
    creditsRemaining: user.credits || 0,
    streak: user.streak || 0,
    totalInterviews: user.totalInterviews || 0,
    averageScore: user.averageScore || 0,
    badges: user.badges || [],
  },
  stats: [
    {
      title: "Total Interviews",
      value: `${user.totalInterviews || 0}`,
      delta: "+14%",
    },
    {
      title: "Average Score",
      value: `${user.averageScore || 0}`,
      delta: "+7 pts",
    },
    {
      title: "Interview Streak",
      value: `${user.streak || 0} days`,
      delta: "+2 days",
    },
    {
      title: "Credits Remaining",
      value: `${user.credits || 0}`,
      delta: "10 added",
    },
  ],
  quickActions: [
    {
      title: "Start AI Interview",
      label: "Launch a guided practice session.",
      icon: "Zap",
    },
    {
      title: "Upload Resume",
      label: "Get instant resume feedback.",
      icon: "Upload",
    },
    {
      title: "Practice DSA",
      label: "Solve curated coding drills.",
      icon: "Code2",
    },
    {
      title: "Join Live Room",
      label: "Collaborate with mentors.",
      icon: "Users",
    },
    {
      title: "Create Mock Session",
      label: "Build a custom interview plan.",
      icon: "ClipboardCheck",
    },
  ],
});

const toDisplayInterviewStatus = (status) => {
  // DashboardOverview expects: Passed, Review, Needs Practice (or fallback)
  switch (status) {
    case "completed":
      return "Passed";
    case "review":
      return "Review";
    case "in-progress":
      return "Needs Practice";
    default:
      return "Review";
  }
};

const toRecentInterviewRow = (interview) => {
  const topic = interview?.techStack?.[0] || interview?.role || "Interview";

  // InterviewCard uses interview.score, so DashboardOverview uses same numeric field
  const score = Math.round(Number(interview?.score ?? 0));

  const date = interview?.createdAt
    ? new Date(interview.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      })
    : "";

  return {
    topic,
    difficulty: interview?.difficulty || "medium",
    score,
    date,
    status: toDisplayInterviewStatus(interview?.status),
  };
};

const toWeeklyProgress = (scoreTrend) => {
  // scoreTrend is [{ name, score }...] or [{ subject, value }...]
  if (!Array.isArray(scoreTrend)) return [];

  // Prefer { name, score }
  if (scoreTrend.length && scoreTrend[0] && "name" in scoreTrend[0]) {
    return scoreTrend.slice(-7).map((p) => ({ name: p.name, score: p.score }));
  }

  // Fallback: convert { subject, value } into { name, score }
  return scoreTrend.slice(-7).map((p) => ({ name: p.subject, score: p.value }));
};

const toTopicPerformance = (coding) => {
  const top = coding?.topLanguages || [];
  return top.map((x) => ({ topic: x.language, score: x.count }));
};

const toScoreTrend = (overview) => {
  const items = [];
  if (overview?.interview?.scoreTrend?.length) {
    items.push({
      subject: "Interview",
      value: overview.interview.avgScore || 0,
    });
  }
  if (overview?.resume?.atsScore !== undefined) {
    items.push({ subject: "Resume", value: overview.resume.atsScore });
  }
  if (overview?.coding?.avgScore !== undefined) {
    items.push({ subject: "Coding", value: overview.coding.avgScore });
  }
  return items;
};

const computeInterviewMasteryThisMonthDelta = async (userId) => {
  const { Interview } = await import("../models/InterviewSchema.js");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = monthStart;

  const [thisMonthInterviews, prevMonthInterviews] = await Promise.all([
    Interview.find({
      user: userId,
      status: { $in: ["completed", "review"] },
      createdAt: { $gte: monthStart },
    })
      .select("score")
      .lean(),
    Interview.find({
      user: userId,
      status: { $in: ["completed", "review"] },
      createdAt: { $gte: prevMonthStart, $lt: prevMonthEnd },
    })
      .select("score")
      .lean(),
  ]);

  const avg = (docs) => {
    if (!docs?.length) return 0;
    const sum = docs.reduce((acc, d) => acc + Number(d.score || 0), 0);
    return sum / docs.length;
  };

  const thisAvg = avg(thisMonthInterviews);
  const prevAvg = avg(prevMonthInterviews);

  // Convert to % on a 0-100 scale.
  const thisMastery = Math.max(0, Math.min(100, thisAvg));
  const prevMastery = Math.max(0, Math.min(100, prevAvg));

  // If no baseline, treat delta as 0 to avoid NaN/Infinity.
  if (!prevMonthInterviews?.length) {
    return {
      masteryPercent: Math.round(thisMastery),
      deltaPercent: 0,
    };
  }

  const delta = thisMastery - prevMastery;
  return {
    masteryPercent: Math.round(thisMastery),
    deltaPercent: Math.round(delta),
  };
};

const makeRecommendationsFromInsights = (insights) => {
  const strengths = insights?.strengths || [];
  const weaknesses = insights?.weaknesses || [];
  const nextSteps = insights?.nextSteps || [];

  const recs = [];
  if (weaknesses[0]) {
    recs.push({
      title: `Weakness: ${weaknesses[0]}`,
      description: "Focus on the listed improvement area this week.",
    });
  }
  if (strengths[0]) {
    recs.push({
      title: `Strength: ${strengths[0]}`,
      description: "Keep reinforcing your strongest skill patterns.",
    });
  }
  if (nextSteps[0]) {
    recs.push({
      title: "Next step",
      description: nextSteps[0],
    });
  }

  // Ensure at least 3 items so UI doesn't look empty
  while (recs.length < 3) {
    recs.push({
      title: "Recommendation",
      description: "Complete a small targeted improvement action.",
    });
  }

  return recs.slice(0, 5);
};

const makeTimeline = async (userId) => {
  // Build a simple dynamic activity timeline from credit usage.
  // Frontend timeline item shape: { label, detail, date }
  const { CreditUsage } = await import("../models/CreditUsageSchema.js");

  const creditHistory = await CreditUsage.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  const featureLabelMap = {
    "ai-interview": "Completed AI interview",
    "mock-interview": "Completed mock interview",
    "resume-analysis": "Resume analyzed",
    "coding-arena": "Coding arena session",
    "analytics-report": "Analytics report generated",
    "premium-feedback": "Premium feedback",
  };

  const formatRelativeDate = (ts) => {
    if (!ts) return "";
    const d = new Date(ts).getTime();
    const diffMs = Date.now() - d;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 24) return `${Math.max(1, diffHrs)} hours ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7)
      return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  };

  const timeline = creditHistory.map((entry) => {
    const label = featureLabelMap[entry.featureUsed] || "Credits consumed";
    const detail = `${entry.creditsConsumed} credit${entry.creditsConsumed === 1 ? "" : "s"} used`;
    const date = formatRelativeDate(entry.createdAt || entry.usageDate);
    return { label, detail, date };
  });

  // Ensure UI always has content
  if (!timeline.length) {
    return [
      {
        label: "No recent activity",
        detail: "Your credit usage history will appear here.",
        date: "",
      },
    ];
  }

  return timeline;
};

const makeAchievements = () => [
  { name: "Elite streak", detail: "7 days in a row", icon: "Award" },
  { name: "High score", detail: "90+ on 4 interviews", icon: "Sparkles" },
  { name: "Premium prep", detail: "Resume polished", icon: "ShieldCheck" },
];

export const getOverview = catchAsyncErrors(async (req, res) => {
  const user = req.user;

  const [analyticsOverview] = await Promise.all([
    getAnalyticsOverviewService(user.id),
    // keep Promise.all pattern for future expansion; interviewAnalytics isn't required now
    Promise.resolve(null),
  ]);

  const interviewMasteryThisMonth = await computeInterviewMasteryThisMonthDelta(
    user.id,
  );

  const recentInterviews = await (async () => {
    const { Interview } = await import("../models/InterviewSchema.js");
    const docs = await Interview.find({ user: user.id })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("techStack role difficulty score status createdAt")
      .lean();

    return docs.map(toRecentInterviewRow);
  })();

  const recommendations = (() => {
    const interviewAvg = analyticsOverview?.interview?.avgScore ?? 0;
    const resumeAts = analyticsOverview?.resume?.atsScore ?? 0;
    const codingAvg = analyticsOverview?.coding?.avgScore ?? 0;

    const recs = [];

    if (resumeAts < 60) {
      recs.push({
        title: "Weakness: Resume ATS optimization",
        description:
          "Improve keywords and ATS formatting based on your latest resume analysis.",
      });
    } else {
      recs.push({
        title: "Strength: Resume is on track",
        description: "Keep iterating your resume with role-relevant keywords.",
      });
    }

    if (codingAvg < 60) {
      recs.push({
        title: "Weakness: Coding accuracy",
        description:
          "Focus on problem-solving and correctness using short daily practice.",
      });
    } else {
      recs.push({
        title: "Strength: Coding performance",
        description:
          "Maintain consistency by reviewing solutions and edge cases.",
      });
    }

    if (interviewAvg < 60) {
      recs.push({
        title: "Weakness: Interview readiness",
        description:
          "Practice targeted mock interviews focusing on clarity and depth.",
      });
    } else {
      recs.push({
        title: "Strength: Interview performance",
        description:
          "Continue refining your strongest patterns and polish weak areas.",
      });
    }

    // Ensure at least 3
    while (recs.length < 3) {
      recs.push({
        title: "Next step",
        description: "Complete a small targeted improvement action.",
      });
    }

    return recs.slice(0, 5);
  })();

  // DashboardOverview recent table: last 4 interview sessions

  // Shape must match DashboardOverview mapping: {topic, difficulty, score, date, status}
  // (removed duplicate recentInterviews declaration)

  res.status(200).json({
    success: true,
    overview: {
      ...makeOverview(user),
      recentInterviews,
      analytics: {
        weeklyProgress: toWeeklyProgress(
          analyticsOverview?.interview?.scoreTrend,
        ),
        topicPerformance: toTopicPerformance(
          await getCodingAnalyticsService(user.id),
        ),
        scoreTrend: toScoreTrend(analyticsOverview),

        // Used by DashboardOverview welcome banner
        interviewMasteryPercent: interviewMasteryThisMonth?.masteryPercent ?? 0,
        interviewMasteryThisMonthDeltaPercent:
          interviewMasteryThisMonth?.deltaPercent ?? 0,
      },

      recommendations,
      timeline: await makeTimeline(user.id),
      achievements: makeAchievements(),
    },
  });
});

export const getInterviews = catchAsyncErrors(async (req, res) => {
  // Dashboard interview list is not yet wired to real Interview docs.
  // Return empty list instead of hard-coded values.
  res.status(200).json({
    success: true,
    interviews: [],
  });
});

export const getAnalytics = catchAsyncErrors(async (req, res) => {
  const userId = req.user.id;
  const [analyticsOverview, coding] = await Promise.all([
    getAnalyticsOverviewService(userId),
    getCodingAnalyticsService(userId),
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      weeklyProgress: toWeeklyProgress(
        analyticsOverview?.interview?.scoreTrend,
      ),
      topicPerformance: toTopicPerformance(coding),
      scoreTrend: toScoreTrend(analyticsOverview),
    },
  });
});

export const getRecommendations = catchAsyncErrors(async (req, res) => {
  const userId = req.user.id;
  const analyticsOverview = await getAnalyticsOverviewService(userId);

  const recommendations = (() => {
    const interviewAvg = analyticsOverview?.interview?.avgScore ?? 0;
    const resumeAts = analyticsOverview?.resume?.atsScore ?? 0;
    const codingAvg = analyticsOverview?.coding?.avgScore ?? 0;

    const recs = [];

    if (resumeAts < 60) {
      recs.push({
        title: "Weakness: Resume ATS optimization",
        description:
          "Improve keywords and ATS formatting based on your latest resume analysis.",
      });
    } else {
      recs.push({
        title: "Strength: Resume is on track",
        description: "Keep iterating your resume with role-relevant keywords.",
      });
    }

    if (codingAvg < 60) {
      recs.push({
        title: "Weakness: Coding accuracy",
        description:
          "Focus on problem-solving and correctness using short daily practice.",
      });
    } else {
      recs.push({
        title: "Strength: Coding performance",
        description:
          "Maintain consistency by reviewing solutions and edge cases.",
      });
    }

    if (interviewAvg < 60) {
      recs.push({
        title: "Weakness: Interview readiness",
        description:
          "Practice targeted mock interviews focusing on clarity and depth.",
      });
    } else {
      recs.push({
        title: "Strength: Interview performance",
        description:
          "Continue refining your strongest patterns and polish weak areas.",
      });
    }

    while (recs.length < 3) {
      recs.push({
        title: "Next step",
        description: "Complete a small targeted improvement action.",
      });
    }

    return recs.slice(0, 5);
  })();

  res.status(200).json({
    success: true,
    recommendations,
  });
});

export const getTimeline = catchAsyncErrors(async (req, res) => {
  const userId = req.user.id;
  const timeline = await makeTimeline(userId);
  res.status(200).json({
    success: true,
    timeline,
  });
});

export const getAchievements = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    achievements: makeAchievements(),
  });
});

export const getPayments = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    payments: {
      balance: req.user.credits || 0,
      transactions: [
        {
          id: "TXN-1001",
          title: "Premium interview pack",
          amount: 18,
          date: "May 15",
          status: "Completed",
        },
        {
          id: "TXN-1002",
          title: "Credit refill",
          amount: 12,
          date: "May 08",
          status: "Completed",
        },
      ],
    },
  });
});

export const getSettings = catchAsyncErrors(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    settings: {
      fullName: user.fullName,
      email: user.email,
      bio: user.bio || "",
      skills: user.skills || [],
      githubURL: user.githubURL || "",
      linkedinURL: user.linkedinURL || "",
      portfolioURL: user.portfolioURL || "",
      leetcodeURL: user.leetcodeURL || "",
      credits: user.credits || 0,
      streak: user.streak || 0,
      badges: user.badges || [],
    },
  });
});
