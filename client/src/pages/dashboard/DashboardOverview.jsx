import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import {
  Award,
  CalendarDays,
  Code2,
  ClipboardCheck,
  Sparkles,
  Upload,
  Users,
  ShieldCheck,
  Zap,
  Bot,
  FileText,
  LineChart,
  Mic,
} from "lucide-react";
import AnalyticsCharts from "../../components/dashboard/AnalyticsCharts.jsx";
import StatCard from "../../components/dashboard/StatCard.jsx";
import { useDashboardStore } from "../../store/dashboardStore.js";

// Mapping Tailwind style configurations for dynamic statuses
const statusClasses = {
  Passed:
    "rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500 dark:text-emerald-200 self-start sm:self-center text-center",
  Review:
    "rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-200 self-start sm:self-center text-center",
  "Needs Practice":
    "rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-200 self-start sm:self-center text-center",
};

const DashboardOverview = () => {
  // Global context usage
  const { darkMode } = useContext(ThemeContext);

  const {
    loading,
    stats = [],
    recentInterviews = [],
    analytics,
    quickActions = [],
    recommendations = [],
    timeline = [],
    achievements = [],
    overview,
    initializeDashboard,
  } = useDashboardStore();

  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  // Reusable explicit theme variables
  const containerClass = darkMode ? "bg-slate-900" : "bg-slate-50";
  const panelClass = darkMode
    ? "border-white/10 bg-slate-950/40"
    : "border-slate-200 bg-white";
  const cardClass = darkMode
    ? "border-white/5 bg-slate-900/40"
    : "border-slate-200 bg-slate-50";
  const innerSubtleClass = darkMode
    ? "bg-slate-950/40 border-white/5"
    : "bg-white border-slate-100";

  const titleClass = darkMode ? "text-white" : "text-slate-900";
  const textClass = darkMode ? "text-slate-400" : "text-slate-600";
  const labelMutedClass = darkMode ? "text-slate-500" : "text-slate-400";

  const quickIconMap = {
    aiInterview: Mic,
    resumeAnalyzer: FileText,
    codingArena: Code2,
    advancedAnalytics: LineChart,

    // Backward compatibility with existing store icon keys (if any)
    Zap,
    Upload,
    Users,
    ClipboardCheck,
    Bot,
  };

  const achievementIconMap = {
    Award,
    Sparkles,
    ShieldCheck,
  };

  return (
    <div
      className={`space-y-6 p-4 sm:p-6 min-h-screen transition-colors duration-300 ${containerClass}`}
    >
      {/* Welcome Banner Header */}
      <section
        className={`rounded-[2rem] border p-6 sm:p-8 shadow-sm backdrop-blur-xl overflow-hidden ${panelClass}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p
              className={`text-xs uppercase tracking-[0.3em] font-bold ${labelMutedClass}`}
            >
              Welcome back
            </p>
            <h2
              className={`mt-2 text-3xl font-semibold sm:text-4xl tracking-tight ${titleClass}`}
            >
              Ready for your next interview?
            </h2>
          </div>
          <span
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] transition-all duration-300 self-start sm:self-center ${
              darkMode
                ? "bg-gradient-to-r from-blue-500/15 to-violet-500/15 text-cyan-200 shadow-inner shadow-blue-950/20"
                : "bg-gradient-to-r from-blue-50 to-violet-50 text-blue-600 border border-blue-100"
            }`}
          >
            Elite Level
          </span>
        </div>

        {/* Focus Matrix Grid */}
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <div
            className={`rounded-2xl border p-6 flex flex-col justify-between gap-6 ${cardClass}`}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p
                  className={`text-xs uppercase tracking-[0.3em] font-bold ${labelMutedClass}`}
                >
                  Daily focus
                </p>
                <h3
                  className={`text-2xl font-semibold tracking-tight ${titleClass}`}
                >
                  Carry momentum with AI-powered prep
                </h3>
                <p className={`max-w-xl text-sm leading-relaxed ${textClass}`}>
                  Continue the streak, build confidence, and finish your mock
                  interview review before the end of the week.
                </p>
              </div>
            </div>
            <div
              className={`rounded-xl border p-5 shadow-sm dark:shadow-inner dark:shadow-black/20 ${innerSubtleClass}`}
            >
              {(() => {
                // Overall mastery = average of Interview + Resume + Coding scores
                const overallMastery =
                  analytics?.scoreTrend?.length > 0
                    ? analytics.scoreTrend.reduce(
                        (sum, item) => sum + Number(item.value || 0),
                        0,
                      ) / analytics.scoreTrend.length
                    : 0;

                const safeMastery = Math.round(overallMastery);

                // Progress improvement based on weekly scores
                const weekly = analytics?.weeklyProgress || [];

                const delta =
                  weekly.length >= 2
                    ? Number(weekly[weekly.length - 1]?.score || 0) -
                      Number(weekly[0]?.score || 0)
                    : 0;

                const safeDelta = Math.round(delta);

                return (
                  <>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p
                          className={`text-xs uppercase tracking-[0.3em] font-bold ${labelMutedClass}`}
                        >
                          Progress
                        </p>

                        <h4
                          className={`mt-1 text-xl font-semibold ${titleClass}`}
                        >
                          {safeMastery}% Overall Mastery
                        </h4>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          safeDelta >= 0
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                            : "bg-red-500/10 text-red-600 dark:text-red-300"
                        }`}
                      >
                        {safeDelta > 0 ? "+" : ""}
                        {safeDelta}% this month
                      </span>
                    </div>

                    <div
                      className={`mt-4 h-2.5 overflow-hidden rounded-full ${
                        darkMode ? "bg-slate-800" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 transition-all duration-700"
                        style={{
                          width: `${Math.min(Math.max(safeMastery, 0), 100)}%`,
                        }}
                      />
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Action Hub Panels */}
          <div className="space-y-6">
            <div
              className={`rounded-2xl border p-6 shadow-sm dark:shadow-2xl dark:shadow-black/30 backdrop-blur-xl ${panelClass}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p
                    className={`text-xs uppercase tracking-[0.3em] font-bold ${labelMutedClass}`}
                  >
                    Credits remaining
                  </p>
                  <p className={`mt-1 text-4xl font-extrabold ${titleClass}`}>
                    {overview?.userSummary?.creditsRemaining ?? 0}
                  </p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 text-white dark:text-slate-950 shadow-md shadow-blue-500/20 dark:shadow-cyan-950/25">
                  <Zap size={22} />
                </div>
              </div>
              <p className={`mt-4 text-sm leading-relaxed ${textClass}`}>
                Good pacing. Use your premium credits for AI interviews or live
                coaching rounds.
              </p>
            </div>

            <div
              className={`rounded-2xl border p-6 shadow-sm ${innerSubtleClass}`}
            >
              <p
                className={`text-xs uppercase tracking-[0.3em] font-bold ${labelMutedClass}`}
              >
                Motivation
              </p>
              <h3
                className={`mt-2 text-xl font-semibold tracking-tight ${titleClass}`}
              >
                Your best next step
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${textClass}`}>
                {recommendations?.[0]?.description ||
                  "Start an AI interview with a focus on system design and polish."}
              </p>

              <Link
                to="/dashboard/ai-interviews/create"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white dark:text-slate-950 shadow-md shadow-blue-500/10 dark:shadow-blue-950/30 transition hover:opacity-95 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Zap size={16} />
                Start AI Interview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Cards Grid */}
      {(() => {
        const interviewScore =
          analytics?.scoreTrend?.find((item) => item.subject === "Interview")
            ?.value || 0;

        const resumeScore =
          analytics?.scoreTrend?.find((item) => item.subject === "Resume")
            ?.value || 0;

        const codingScore =
          analytics?.scoreTrend?.find((item) => item.subject === "Coding")
            ?.value || 0;

        const overallMastery =
          analytics?.scoreTrend?.length > 0
            ? Math.round(
                analytics.scoreTrend.reduce(
                  (sum, item) => sum + Number(item.value || 0),
                  0,
                ) / analytics.scoreTrend.length,
              )
            : 0;

        const metricCards = [
          {
            title: "Overall Mastery",
            value: `${overallMastery}%`,
            delta: `${analytics?.scoreTrend?.length || 0} modules`,
            icon: Award,
          },
          {
            title: "Interviews",
            value: `${Math.round(interviewScore)}%`,
            delta: `${recentInterviews?.length || 0} Completed`,
            icon: Sparkles,
          },
          {
            title: "Resume Score",
            value: `${Math.round(resumeScore)}%`,
            delta: "ATS Analysis",
            icon: CalendarDays,
          },
          {
            title: "Coding Score",
            value: `${Math.round(codingScore)}%`,
            delta: "Problem Solving",
            icon: Zap,
          },
        ];

        return (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((card) => (
              <StatCard
                key={card.title}
                title={card.title}
                value={card.value}
                delta={card.delta}
                icon={card.icon}
              />
            ))}
          </section>
        );
      })()}

      {/* Main Analysis and Navigation Matrix */}
      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`rounded-2xl border p-6 shadow-sm ${panelClass}`}
        >
          <div
            className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4 ${darkMode ? "border-white/5" : "border-slate-100"}`}
          >
            <div>
              <p
                className={`text-xs uppercase tracking-[0.24em] font-bold ${labelMutedClass}`}
              >
                Recent interviews
              </p>
              <h3 className={`text-lg font-semibold ${titleClass}`}>
                Last 4 sessions
              </h3>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] self-start sm:self-center ${darkMode ? "bg-slate-900/80 text-slate-400" : "bg-slate-100 text-slate-500"}`}
            >
              Updated just now
            </span>
          </div>

          <div
            className={`mt-5 overflow-hidden rounded-2xl border ${darkMode ? "border-white/10 bg-slate-950/30" : "border-slate-100 bg-slate-50/50"}`}
          >
            {/* Table Header Row */}
            <div
              className={`hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b px-5 py-3 text-[11px] font-bold uppercase tracking-[0.25em] sm:grid ${darkMode ? "border-white/10 bg-slate-950/80 text-slate-500" : "border-slate-200/60 bg-slate-100/70 text-slate-400"}`}
            >
              <span>Topic</span>
              <span>Difficulty</span>
              <span>Score</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            {/* Table Body Content */}
            <div
              className={`divide-y ${darkMode ? "divide-white/5" : "divide-slate-100"}`}
            >
              {loading ? (
                Array.from({ length: 4 }, (_, idx) => (
                  <div
                    key={idx}
                    className="grid gap-4 px-5 py-4 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] animate-pulse items-center"
                  >
                    <div className="space-y-2">
                      <div
                        className={`h-4 w-3/4 rounded-full ${darkMode ? "bg-slate-800/80" : "bg-slate-200"}`}
                      />
                      <div
                        className={`h-3 w-1/2 rounded-full ${darkMode ? "bg-slate-800/40" : "bg-slate-100"}`}
                      />
                    </div>
                    <div
                      className={`h-4 w-20 rounded-full hidden sm:block ${darkMode ? "bg-slate-800/80" : "bg-slate-200"}`}
                    />
                    <div
                      className={`h-4 w-10 rounded-full hidden sm:block ${darkMode ? "bg-slate-800/80" : "bg-slate-200"}`}
                    />
                    <div
                      className={`h-4 w-16 rounded-full hidden sm:block ${darkMode ? "bg-slate-800/80" : "bg-slate-200"}`}
                    />
                    <div
                      className={`h-6 w-20 rounded-full hidden sm:block ${darkMode ? "bg-slate-800/80" : "bg-slate-200"}`}
                    />
                  </div>
                ))
              ) : recentInterviews.length > 0 ? (
                recentInterviews.map((interview) => (
                  <div
                    key={interview.topic}
                    className={`grid gap-2 sm:gap-4 px-5 py-4 text-sm sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center transition ${darkMode ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-100/20"}`}
                  >
                    <div>
                      <p className={`font-semibold ${titleClass}`}>
                        {interview.topic}
                      </p>
                      <p className={`mt-0.5 text-xs ${labelMutedClass}`}>
                        AI interview scenario
                      </p>
                    </div>
                    <div className="flex sm:block justify-between text-xs sm:text-sm">
                      <span className="sm:hidden font-medium text-slate-400">
                        Difficulty:{" "}
                      </span>
                      <span>{interview.difficulty}</span>
                    </div>
                    <div className="flex sm:block justify-between text-xs sm:text-sm">
                      <span className="sm:hidden font-medium text-slate-400">
                        Score:{" "}
                      </span>
                      <span className={`font-semibold ${titleClass}`}>
                        {interview.score}%
                      </span>
                    </div>
                    <div className="flex sm:block justify-between text-xs sm:text-sm">
                      <span className="sm:hidden font-medium text-slate-400">
                        Date:{" "}
                      </span>
                      <span className="text-slate-400">{interview.date}</span>
                    </div>
                    <span
                      className={
                        statusClasses[interview.status] ||
                        statusClasses["Review"]
                      }
                    >
                      {interview.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-12 px-6 text-center">
                  <p
                    className={`text-xs uppercase tracking-[0.28em] font-bold ${labelMutedClass}`}
                  >
                    No recent interviews
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-700 dark:text-white">
                    Your activity will appear here.
                  </h3>
                  <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
                    Start an AI interview or create a mock session to populate
                    your progress dashboard.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Analytics & Fast Path Layout */}
        <div className="space-y-6">
          <AnalyticsCharts analytics={analytics} />

          <div className={`rounded-2xl border p-6 shadow-sm ${panelClass}`}>
            <div
              className={`border-b pb-4 ${darkMode ? "border-white/5" : "border-slate-100"}`}
            >
              <p
                className={`text-xs uppercase tracking-[0.24em] font-bold ${labelMutedClass}`}
              >
                Quick actions
              </p>
              <h3 className={`text-lg font-semibold ${titleClass}`}>
                Jump right in
              </h3>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "🎤 AI Interview Simulator",
                  label: "Generate role-specific interview questions with AI.",
                  icon: "aiInterview",
                  to: "/dashboard/ai-interviews/create",
                },
                {
                  title: "AI Resume Analyzer",
                  label:
                    "Upload and analyze resumes. Get ATS score & improvements.",
                  icon: "resumeAnalyzer",
                  to: "/dashboard/resume",
                },
                {
                  title: "Coding Arena",
                  label:
                    "Practice online coding with challenges and instant evaluation.",
                  icon: "codingArena",
                  to: "/dashboard/coding",
                },
                {
                  title: "Advanced Analytics Dashboard",
                  label:
                    "Track interview, resume, and coding performance trends.",
                  icon: "advancedAnalytics",
                  to: "/dashboard/analytics",
                },
              ].map((feature) => {
                const Icon = quickIconMap[feature.icon] || Zap;
                return (
                  <Link
                    key={feature.to}
                    to={feature.to}
                    className={`group flex flex-col gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                      darkMode
                        ? "border-white/10 bg-slate-950/70 hover:bg-white/5"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-md shadow-blue-500/10 dark:shadow-blue-950/20">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p
                        className={`font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition ${titleClass}`}
                      >
                        {feature.title}
                      </p>
                      <p
                        className={`mt-1 text-xs leading-normal ${labelMutedClass}`}
                      >
                        {feature.label}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Auxiliary Context & Dynamic Badges Grid */}
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className={`rounded-2xl border p-6 shadow-sm ${panelClass}`}>
          <div
            className={`border-b pb-4 ${darkMode ? "border-white/5" : "border-slate-100"}`}
          >
            <p
              className={`text-xs uppercase tracking-[0.24em] font-bold ${labelMutedClass}`}
            >
              AI recommendations
            </p>
            <h3 className={`text-lg font-semibold ${titleClass}`}>
              Smart next steps
            </h3>
          </div>

          <div className="mt-5 grid gap-4">
            {recommendations.map((item) => (
              <div
                key={item.title}
                className={`rounded-xl border p-4 transition hover:shadow-md ${
                  darkMode
                    ? "border-white/5 bg-slate-950/40 hover:bg-slate-900/40"
                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                }`}
              >
                <p className={`text-sm font-semibold ${titleClass}`}>
                  {item.title}
                </p>
                <p
                  className={`mt-1 text-xs leading-relaxed ${labelMutedClass}`}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline & Accomplishments Track */}
        <div className="space-y-6">
          <div className={`rounded-2xl border p-6 shadow-sm ${panelClass}`}>
            <div
              className={`border-b pb-4 ${darkMode ? "border-white/5" : "border-slate-100"}`}
            >
              <p
                className={`text-xs uppercase tracking-[0.24em] font-bold ${labelMutedClass}`}
              >
                Activity timeline
              </p>
              <h3 className={`text-lg font-semibold ${titleClass}`}>
                What you did
              </h3>
            </div>
            <div className="mt-5 space-y-4 max-h-[320px] overflow-y-auto pr-1">
              {timeline.map((event, index) => (
                <div
                  key={`${event.label}-${event.date}-${index}`}
                  className={`rounded-xl border p-4 ${cardClass}`}
                >
                  <div className="flex items-center justify-between gap-4 text-xs font-medium text-slate-400">
                    <p>{event.date}</p>
                  </div>
                  <p
                    className={`mt-2 text-sm font-semibold ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                  >
                    {event.label}
                  </p>
                  <p className={`mt-1 text-xs ${labelMutedClass}`}>
                    {event.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl border p-6 shadow-sm ${panelClass}`}>
            <div
              className={`border-b pb-4 ${darkMode ? "border-white/5" : "border-slate-100"}`}
            >
              <p
                className={`text-xs uppercase tracking-[0.24em] font-bold ${labelMutedClass}`}
              >
                Achievements
              </p>
              <h3 className={`text-lg font-semibold ${titleClass}`}>
                Badges unlocked
              </h3>
            </div>
            <div className="mt-5 grid gap-4">
              {achievements.map((item) => {
                const Icon = achievementIconMap[item.icon] || Award;
                return (
                  <div
                    key={item.name}
                    className={`flex items-center gap-4 rounded-xl border p-3.5 ${
                      darkMode
                        ? "border-white/5 bg-slate-950/30"
                        : "border-slate-100 bg-slate-50/50"
                    }`}
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-sm">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${titleClass}`}>
                        {item.name}
                      </p>
                      <p className={`text-xs mt-0.5 ${labelMutedClass}`}>
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardOverview;
