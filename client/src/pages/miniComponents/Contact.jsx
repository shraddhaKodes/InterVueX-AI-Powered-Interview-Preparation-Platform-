import axios from "axios";
import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaPaperPlane,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const contactItems = [
  {
    icon: <FaEnvelope />,
    label: "Email Support",
    val: "support@intervuex.com",
  },
  {
    icon: <FaPhoneAlt />,
    label: "Phone",
    val: "+91 98765 43210",
  },
  {
    icon: <FaMapMarkerAlt />,
    label: "Office",
    val: "Bengaluru, India",
  },
];

const Contact = () => {
  const { darkMode } = useContext(ThemeContext);
  const [senderName, setSenderName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMessage = async (e) => {
    e.preventDefault();
    if (!senderName || !subject || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/message/send`,
        { senderName, subject, message },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      toast.success(res.data.message);
      setSenderName("");
      setSubject("");
      setMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div
      id="contact"
      className={`w-full py-24 px-6 sm:px-12 lg:px-24 transition-colors duration-500 ${
        darkMode ? "bg-slate-950" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={`text-5xl font-black mb-6 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Need help preparing?
              <br />
              <span className="text-cyan-400">
                Reach out to InterVueX support.
              </span>
            </h2>
            <p
              className={`text-lg mb-10 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              Questions about onboarding, interview practice, or account setup?
              Our team is ready to help you become interview ready.
            </p>

            <div className="space-y-6">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={`p-4 rounded-xl ${darkMode ? "bg-slate-800 text-cyan-300" : "bg-cyan-50 text-cyan-600"}`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-bold uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-800"}`}
                    >
                      {item.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleMessage}
            className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${
              darkMode
                ? "bg-slate-900 border-slate-700 shadow-cyan-950/10"
                : "bg-white border-slate-100 shadow-slate-200"
            }`}
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  className={`text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full p-4 rounded-xl border outline-none transition-all ${
                    darkMode
                      ? "bg-slate-950 border-slate-700 text-white focus:border-cyan-400"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-400"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label
                  className={`text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                >
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Account help"
                  className={`w-full p-4 rounded-xl border outline-none transition-all ${
                    darkMode
                      ? "bg-slate-950 border-slate-700 text-white focus:border-cyan-400"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-400"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className={`text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
              >
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question"
                rows="5"
                className={`w-full p-4 rounded-xl border outline-none transition-all resize-none ${
                  darkMode
                    ? "bg-slate-950 border-slate-700 text-white focus:border-cyan-400"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-400"
                }`}
              ></textarea>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-black rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/30 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <FaPaperPlane /> SEND MESSAGE
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
