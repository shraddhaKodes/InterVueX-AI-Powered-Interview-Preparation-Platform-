import { useEffect, useMemo, useState, useContext } from "react";
import { motion } from "framer-motion";
import AnalyticsCharts from "../../components/dashboard/AnalyticsCharts.jsx";
import RecommendationCard from "../../components/analytics/RecommendationCard.jsx";
import StrengthWeaknessCard from "../../components/analytics/StrengthWeaknessCard.jsx";
import CareerScoreCard from "../../components/analytics/CareerScoreCard.jsx";

import { useDashboardStore } from "../../store/dashboardStore.js";
import { useAnalyticsStore } from "../../store/analyticsStore.js";
import { getRecommendations } from "../../api/analyticsApi.js";
import { ThemeContext } from "../../context/ThemeContext.jsx";
const AnalyticsPage = () => {
  const { analytics, loading, loadAnalytics, recommendations, overview } =
    useDashboardStore();
  const { darkMode } = useContext(ThemeContext);

  const {
    recommendations: analyticsRecommendations,
    loadAllAnalytics,
    loading: analyticsLoading,
    error,
  } = useAnalyticsStore();

  const [recoLoading, setRecoLoading] = useState(false);
  const [recoError, setRecoError] = useState("");
  const [lastRecoMode, setLastRecoMode] = useState("latest");

  useEffect(() => {
    loadAnalytics();
    // loadAllAnalytics loads the full analytics module for analytics page use-cases
    loadAllAnalytics?.();
  }, [loadAnalytics, loadAllAnalytics]);

  const displayedRecommendations = useMemo(() => {
    return (
      analyticsRecommendations ||
      recommendations || {
        nextSteps: [],
        confidenceNotes: "",
        careerReadinessScore: 0,
      }
    );
  }, [analyticsRecommendations, recommendations]);

  const displayedScore =
    displayedRecommendations?.careerReadinessScore ??
    overview?.userSummary?.averageScore ??
    0;

  const runLatest = async () => {
    setRecoError("");
    setRecoLoading(true);
    try {
      // latest = cached recommendations if available
      const res = await getRecommendations();
      // response shape: { success, recommendations, aiInsights, cached }
      const recos = res?.recommendations;
      if (recos) {
        setLastRecoMode("latest");
      }
      // persist to analytics store by reloading
      await loadAllAnalytics?.();
    } catch (e) {
      setRecoError(e?.message || "Failed to load latest recommendations");
    } finally {
      setRecoLoading(false);
    }
  };

  const runGenerate = async () => {
    setRecoError("");
    setRecoLoading(true);
    try {
      // Generate & Save forces regeneration (overwrites recommendationsCache)
      // even when cache exists.
      const res = await getRecommendations({ force: true });

      // If backend mistakenly returns cached=true with force=true, surface it
      // (and do a single delayed retry instead of spamming multiple loads).
      if (res?.cached === true) {
        setRecoError(
          "Generate & Save returned cached insights even with force=true. Retrying...",
        );

        // Retry once after a short delay to allow persistence to complete.
        await new Promise((r) => setTimeout(r, 1200));
        const retryRes = await getRecommendations({ force: true });

        if (retryRes?.cached !== true) {
          setRecoError("");
          setLastRecoMode("generated");
        }
      } else {
        setLastRecoMode("generated");
      }

      // Reload all analytics once to refresh recommendations in store.
      await loadAllAnalytics?.();
    } catch (e) {
      setRecoError(e?.message || "Failed to generate recommendations");
    } finally {
      setRecoLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="dashboard-heading">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            Analytics
          </p>
          <h2
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Interview performance
          </h2>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={recoLoading}
            className="rounded-2xl bg-slate-900/80 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            onClick={runLatest}
          >
            {recoLoading && lastRecoMode === "latest"
              ? "Loading..."
              : "Get Latest Insights"}
          </button>

          <button
            type="button"
            disabled={recoLoading}
            className="rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            onClick={runGenerate}
          >
            {recoLoading && lastRecoMode === "generated"
              ? "Generating..."
              : "Generate & Save"}
          </button>
        </div>

        {recoError ? (
          <div className="mt-2 text-sm text-red-500">{recoError}</div>
        ) : null}
      </div>

      <motion.div
        className="dashboard-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
      >
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-56 rounded-[1.5rem] bg-slate-900/80"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <AnalyticsCharts analytics={analytics} />

            <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <div>
                <RecommendationCard
                  nextSteps={displayedRecommendations?.nextSteps || []}
                  confidenceNotes={
                    displayedRecommendations?.confidenceNotes || ""
                  }
                />

                <div className="mt-5">
                  <StrengthWeaknessCard
                    strengths={displayedRecommendations?.strengths || []}
                    weaknesses={displayedRecommendations?.weaknesses || []}
                  />
                </div>
              </div>

              <div>
                <CareerScoreCard
                  score={displayedRecommendations?.careerReadinessScore}
                />
              </div>
            </div>

            {analyticsLoading && !analyticsRecommendations ? (
              <div className="text-sm text-slate-500">Loading insights...</div>
            ) : null}
          </div>
        )}
      </motion.div>

      {error ? <div className="text-sm text-red-500">{error}</div> : null}
    </div>
  );
};

export default AnalyticsPage;
