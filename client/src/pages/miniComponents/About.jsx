import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FaBrain, FaCode, FaLightbulb, FaChartLine } from "react-icons/fa";
import Event from "../../assets/hero1.jpg";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const About = () => {
  const { darkMode } = useContext(ThemeContext);

  const features = [
    {
      icon: <FaBrain />,
      title: "AI Mock Interviews",
      description: "Practice problem-solving with contextual feedback.",
      color: "text-cyan-400",
    },
    {
      icon: <FaCode />,
      title: "Technical Assessments",
      description: "Solve real interview questions with guided support.",
      color: "text-blue-400",
    },
    {
      icon: <FaLightbulb />,
      title: "Progress Insights",
      description: "Track your strengths, weaknesses and readiness.",
      color: "text-amber-400",
    },
    {
      icon: <FaChartLine />,
      title: "Interview Analytics",
      description: "Review performance data after every session.",
      color: "text-violet-400",
    },
  ];

  return (
    <div
      className={`w-full py-20 px-6 sm:px-12 lg:px-24 transition-colors ${
        darkMode ? "bg-slate-950" : "bg-white"
      }`}
      id="about"
    >
      <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        <motion.div
          className="relative group"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <img
            src={Event}
            alt="AI interview illustration"
            className="relative rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] w-full object-cover"
          />
        </motion.div>

        <div>
          <h2
            className={`text-4xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Why Choose <span className="text-cyan-400">InterVueX?</span>
          </h2>

          <p
            className={`mb-10 text-lg leading-8 ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Build confidence with AI-powered mock interviews, personalized
            feedback, and tracked progress that helps you land your next offer.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`rounded-3xl border p-6 transition-all ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 hover:border-cyan-400"
                    : "bg-slate-50 border-slate-200 hover:border-blue-500"
                }`}
              >
                <div className={`${feature.color} text-3xl mb-4`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className={darkMode ? "text-slate-400" : "text-slate-600"}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
