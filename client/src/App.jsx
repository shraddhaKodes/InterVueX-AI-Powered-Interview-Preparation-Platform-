import { Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import DashboardOverview from "./pages/dashboard/DashboardOverview.jsx";
import AIInterviews from "./pages/dashboard/AIInterviews.jsx";
import CreateInterview from "./pages/dashboard/CreateInterview.jsx";
import InterviewHistory from "./pages/dashboard/InterviewHistory.jsx";
import InterviewResult from "./pages/dashboard/InterviewResult.jsx";
import InterviewSession from "./pages/dashboard/InterviewSession.jsx";
import ResumeAnalyzer from "./pages/dashboard/ResumeAnalyzer.jsx";
import CodingArena from "./pages/dashboard/CodingArena.jsx";
import ChallengeEditorPage from "./pages/dashboard/ChallengeEditorPage.jsx";
import AdminProblems from "./pages/codingArena/AdminProblems.jsx";
import AdminUsers from "./pages/codingArena/AdminUsers.jsx";
import AdminSubmissions from "./pages/codingArena/AdminSubmissions.jsx";
import SubmissionHistory from "./pages/dashboard/SubmissionHistory.jsx";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage.jsx";
import Payments from "./pages/dashboard/Payments.jsx";
import Settings from "./pages/dashboard/Settings.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext.jsx";

const AppContent = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="ai-interviews" element={<AIInterviews />} />
          <Route path="ai-interviews/create" element={<CreateInterview />} />
          <Route path="ai-interviews/history" element={<InterviewHistory />} />
          <Route
            path="ai-interviews/:id/session"
            element={<InterviewSession />}
          />
          <Route
            path="ai-interviews/:id/result"
            element={<InterviewResult />}
          />
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="coding" element={<CodingArena />} />
          <Route path="coding/history" element={<SubmissionHistory />} />
          <Route path="coding/admin" element={<AdminProblems />} />
          <Route
            path="coding/admin/submissions"
            element={<AdminSubmissions />}
          />
          <Route path="coding/admin/users" element={<AdminUsers />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/coding-arena/:problemId" element={<Dashboard />}>
          <Route index element={<ChallengeEditorPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
