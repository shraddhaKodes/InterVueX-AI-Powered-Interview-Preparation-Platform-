import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const Hero = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  return (
    <section className="relative w-full min-h-[calc(100vh-73px)] flex flex-col items-center justify-center text-center px-6 py-4 md:py-0 transition-colors duration-500 overflow-hidden">
      {/* Background Grid */}
      <div
        className={`absolute inset-0 opacity-10 ${
          darkMode
            ? "bg-[radial-gradient(#38bdf8_1px,transparent_1px)]"
            : "bg-[radial-gradient(#0f172a_1px,transparent_1px)]"
        } [background-size:18px_18px]`}
      />

      <div className="relative z-10 max-w-4xl space-y-5 md:space-y-6">
        {/* Badge */}
        <p
          className={`inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase border ${
            darkMode
              ? "bg-slate-800 border-slate-700 text-cyan-300"
              : "bg-white border-slate-200 text-blue-600"
          }`}
        >
          🚀 AI Interview Practice
        </p>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tight">
          Become interview-ready with
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
            InterVueX AI coaching.
          </span>
        </h1>

        {/* Description */}
        <p
          className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Practice technical rounds, receive instant feedback, and track your
          strengths across coding, system design, and behavioral interviews.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <button
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-blue-500/30 transition-all"
            onClick={() => navigate("/signup")}
          >
            Start Free
          </button>

          <button
            className={`w-full sm:w-auto px-8 py-4 font-bold rounded-xl border transition-all ${
              darkMode
                ? "border-slate-700 hover:bg-slate-800"
                : "border-slate-300 hover:bg-slate-100"
            }`}
            onClick={() =>
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            How it works
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
