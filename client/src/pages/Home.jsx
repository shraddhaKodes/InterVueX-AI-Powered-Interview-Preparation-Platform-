import React, { useContext } from "react";
import Hero from "./miniComponents/Hero.jsx";
import About from "./miniComponents/About.jsx";
import Contact from "./miniComponents/Contact.jsx";
import Navbar from "./miniComponents/Navbar.jsx";
import Footer from "./miniComponents/Footer.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className={`transition-all duration-500 min-h-screen ${
        darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Accent/Banner Container */}
      <div className="bg-gradient-to-r from-blue-500 to-violet-500 py-12 text-center mt-[73px]">
        <h1 className="text-3xl font-bold text-white px-4">
          InterVueX — Practice with AI-powered challenges
        </h1>
        <p className="mt-3 text-white/90 px-4 max-w-2xl mx-auto text-sm md:text-base">
          Solve coding problems, run and submit against hidden tests, and get AI feedback.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate("/dashboard/coding")}
            className="px-6 py-2.5 bg-white text-blue-600 font-bold rounded-xl shadow-md hover:bg-slate-50 transition-all text-sm"
          >
            Explore Challenges
          </button>
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/dashboard/coding/admin")}
              className="px-6 py-2.5 bg-transparent border border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all text-sm"
            >
              Manage Problems
            </button>
          )}
        </div>
      </div>

      <main>
        {/* Home/Hero Section */}
        <div id="home">
          <Hero />
        </div>

        {/* Features Section */}
        <div id="features">
          <About />
        </div>

        {/* Dashboard Preview Section */}
        <section
          id="dashboard"
          className={`w-full py-20 px-6 sm:px-12 lg:px-24 transition-colors duration-500 ${
            darkMode ? "bg-slate-950" : "bg-white"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p
                  className={`text-sm uppercase tracking-[0.24em] ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Dashboard
                </p>
                <h2
                  className={`text-4xl font-bold mt-3 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Your practice engine—{" "}
                  <span className="text-cyan-400">ready on day one</span>
                </h2>
                <p
                  className={`mt-4 text-lg leading-8 max-w-2xl ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Run coding challenges, simulate AI interviews, analyze
                  submissions, and track progress with clarity.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-black rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
                >
                  Explore Dashboard
                </button>
                <button
                  onClick={() => navigate("/dashboard/ai-interviews")}
                  className={`px-6 py-3 font-bold rounded-xl border transition-all ${
                    darkMode
                      ? "border-slate-700 hover:bg-slate-800"
                      : "border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  AI Interviews
                </button>
              </div>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {/* Card 1: Coding Challenges */}
              <div
                className={`rounded-3xl border p-7 transition-all hover:-translate-y-1 duration-300 shadow-sm ${
                  darkMode
                    ? "bg-slate-900/40 border-slate-700 hover:border-cyan-400"
                    : "bg-slate-50 border-slate-200 hover:border-cyan-500"
                }`}
              >
                <div className="text-3xl">💻</div>
                <h3
                  className={`text-xl font-bold mt-4 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Coding Challenges
                </h3>
                <p
                  className={`mt-3 text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Practice against hidden tests, run locally, and submit for
                  AI-graded insights.
                </p>
                <button
                  onClick={() => navigate("/dashboard/coding")}
                  className={`mt-5 inline-flex items-center gap-2 font-bold text-sm ${
                    darkMode
                      ? "text-cyan-300 hover:text-cyan-400"
                      : "text-cyan-600 hover:text-cyan-700"
                  }`}
                >
                  Open Dashboard →
                </button>
              </div>

              {/* Card 2: AI Interview Practice */}
              <div
                className={`rounded-3xl border p-7 transition-all hover:-translate-y-1 duration-300 shadow-sm ${
                  darkMode
                    ? "bg-slate-900/40 border-slate-700 hover:border-cyan-400"
                    : "bg-slate-50 border-slate-200 hover:border-cyan-500"
                }`}
              >
                <div className="text-3xl">🧠</div>
                <h3
                  className={`text-xl font-bold mt-4 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  AI Interview Practice
                </h3>
                <p
                  className={`mt-3 text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Mock interviews with structured feedback and performance
                  snapshots.
                </p>
                <button
                  onClick={() => navigate("/dashboard/ai-interviews")}
                  className={`mt-5 inline-flex items-center gap-2 font-bold text-sm ${
                    darkMode
                      ? "text-cyan-300 hover:text-cyan-400"
                      : "text-cyan-600 hover:text-cyan-700"
                  }`}
                >
                  Start Session →
                </button>
              </div>

              {/* Card 3: Performance Insights */}
              <div
                className={`rounded-3xl border p-7 transition-all hover:-translate-y-1 duration-300 shadow-sm ${
                  darkMode
                    ? "bg-slate-900/40 border-slate-700 hover:border-cyan-400"
                    : "bg-slate-50 border-slate-200 hover:border-cyan-500"
                }`}
              >
                <div className="text-3xl">📈</div>
                <h3
                  className={`text-xl font-bold mt-4 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Detailed Analytics
                </h3>
                <p
                  className={`mt-3 text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Track progress variations over timeline analytics and verify your readiness indicators.
                </p>
                <button
                  onClick={() => navigate("/dashboard/analytics")}
                  className={`mt-5 inline-flex items-center gap-2 font-bold text-sm ${
                    darkMode
                      ? "text-cyan-300 hover:text-cyan-400"
                      : "text-cyan-600 hover:text-cyan-700"
                }`}
                >
                  View Insights →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Home;