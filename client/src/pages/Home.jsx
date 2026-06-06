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
      {/* Navbar is inside the themed div so it inherits the context easily */}
      <Navbar />

      <div className="bg-gradient-to-r from-blue-500 to-violet-500 py-12 text-center">
        <h1 className="text-3xl font-bold text-white">
          InterVueX — Practice with AI-powered challenges
        </h1>
        <p className="mt-3 text-white/90">
          Solve coding problems, run and submit against hidden tests, and get AI
          feedback.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate("/dashboard/coding")}
            className="btn-primary"
          >
            Explore Challenges
          </button>
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/dashboard/coding/admin")}
              className="btn-secondary"
            >
              Manage Problems
            </button>
          )}
        </div>
      </div>

      <main>
        <Hero />
        <About />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
