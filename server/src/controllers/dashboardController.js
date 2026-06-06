import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";

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

const makeRecentInterviews = () => [
  {
    topic: "System Design Foundations",
    difficulty: "Hard",
    score: 92,
    date: "May 17",
    status: "Passed",
  },
  {
    topic: "React Performance",
    difficulty: "Medium",
    score: 84,
    date: "May 14",
    status: "Review",
  },
  {
    topic: "Graph Algorithms",
    difficulty: "Hard",
    score: 79,
    date: "May 11",
    status: "Needs Practice",
  },
  {
    topic: "Behavioral Mock Round",
    difficulty: "Easy",
    score: 97,
    date: "May 08",
    status: "Passed",
  },
];

const makeAnalytics = () => ({
  weeklyProgress: [
    { name: "Mon", score: 72 },
    { name: "Tue", score: 78 },
    { name: "Wed", score: 84 },
    { name: "Thu", score: 88 },
    { name: "Fri", score: 85 },
    { name: "Sat", score: 91 },
    { name: "Sun", score: 94 },
  ],
  topicPerformance: [
    { topic: "Algorithms", score: 86 },
    { topic: "System Design", score: 92 },
    { topic: "React", score: 81 },
    { topic: "Data Structures", score: 88 },
  ],
  scoreTrend: [
    { subject: "Mock Sessions", value: 88 },
    { subject: "AI Interview", value: 92 },
    { subject: "Resume Review", value: 76 },
    { subject: "Behavioral", value: 95 },
    { subject: "DSA Practice", value: 84 },
  ],
});

const makeRecommendations = () => [
  {
    title: "Weak topic: Graph Theory",
    description: "Spend 20 minutes on shortest path strategies.",
  },
  {
    title: "Resume improvement",
    description: "Add measurable impact to your project summary.",
  },
  {
    title: "Recommended track",
    description: "Complete the AI Engineering prep path next.",
  },
];

const makeTimeline = () => [
  {
    label: "Completed AI interview",
    detail: "System Design Foundations",
    date: "2 hours ago",
  },
  {
    label: "Purchased credits",
    detail: "+10 interview credits",
    date: "Yesterday",
  },
  {
    label: "Achievement unlocked",
    detail: "Interview streak reward",
    date: "May 15",
  },
];

const makeAchievements = () => [
  { name: "Elite streak", detail: "7 days in a row", icon: "Award" },
  { name: "High score", detail: "90+ on 4 interviews", icon: "Sparkles" },
  { name: "Premium prep", detail: "Resume polished", icon: "ShieldCheck" },
];

export const getOverview = catchAsyncErrors(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    overview: {
      ...makeOverview(user),
      recentInterviews: makeRecentInterviews(),
      analytics: makeAnalytics(),
      recommendations: makeRecommendations(),
      timeline: makeTimeline(),
      achievements: makeAchievements(),
    },
  });
});

export const getInterviews = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    interviews: makeRecentInterviews().map((interview, index) => ({
      ...interview,
      id: index + 1,
      duration: `${35 + index * 5} min`,
      questions: 8 + index,
      scoreBreakdown: {
        technical: interview.score - 6,
        communication: 8,
      },
    })),
  });
});

export const getAnalytics = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    analytics: makeAnalytics(),
  });
});

export const getRecommendations = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    recommendations: makeRecommendations(),
  });
});

export const getTimeline = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    timeline: makeTimeline(),
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
