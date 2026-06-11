import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  background: "#0f172a",
  border: "1px solid rgba(148,163,184,0.2)",
  borderRadius: 16,
  color: "#f8fafc",
  boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
};

const AnalyticsCharts = ({ analytics }) => {
  // Keep existing schema rendering; only make headings safe/dynamic without extra API calls.
  const weeklyProgress = analytics?.weeklyProgress ?? [];
  const topicPerformance = analytics?.topicPerformance ?? [];
  const scoreTrend = analytics?.scoreTrend ?? [];

  const weeklyProgressTitle =
    analytics?.weeklyProgressTitle ?? "Weekly progress";
  const weeklyMomentumTitle =
    analytics?.weeklyMomentumTitle ?? "Interview Score Momentum";
  const weeklyDelta = analytics?.weeklyProgressDelta ?? "+9% this week";

  const topicPerformanceTitle =
    analytics?.topicPerformanceTitle ?? "Topic performance";
  const topicPerformanceHeading =
    analytics?.topicPerformanceHeading ?? "Coding Strength";

  const scoreTrendsTitle = analytics?.scoreTrendsTitle ?? "Score trends";
  const scoreTrendsHeading =
    analytics?.scoreTrendsHeading ?? "AI track summary";

  return (
    <div className="grid gap-5 xl:grid-cols-[1.7fr_1.1fr]">
      <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
              {weeklyProgressTitle}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              {weeklyMomentumTitle}
            </h3>
          </div>
          <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-200">
            {weeklyDelta}
          </span>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analytics.weeklyProgress}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.75} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgba(148,163,184,0.12)"
                vertical={false}
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ stroke: "rgba(148,163,184,0.16)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#progressGradient)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="mb-5">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
              Topic performance
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              Coding Strength
            </h3>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.topicPerformance}
                margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="rgba(148,163,184,0.12)"
                  vertical={false}
                  strokeDasharray="4 4"
                />
                <XAxis
                  dataKey="topic"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "rgba(15,23,42,0.6)" }}
                />
                <Bar dataKey="score" radius={[12, 12, 0, 0]} fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="mb-5">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
              Score trends
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              AI track summary
            </h3>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={analytics.scoreTrend}
              >
                <PolarGrid stroke="rgba(148,163,184,0.12)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.2}
                />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
