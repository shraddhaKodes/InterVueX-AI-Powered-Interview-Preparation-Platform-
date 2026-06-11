import React, { useContext } from "react";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaBrain,
  FaArrowUp,
} from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className={`w-full pt-16 pb-8 px-6 sm:px-12 transition-colors duration-500 border-t ${
        darkMode
          ? "bg-slate-950 text-white border-slate-800"
          : "bg-white text-slate-900 border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <FaBrain className="text-cyan-400 text-3xl" />
              <h2 className="text-2xl font-black tracking-tighter">
                InterVueX
              </h2>
            </div>
            <p
              className={`text-sm leading-relaxed ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              AI-powered interview practice, feedback, and analytics for every
              aspiring developer.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-cyan-400">
              Platform
            </h4>
            <ul
              className={`space-y-2 text-sm ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <li className="hover:text-cyan-400 cursor-pointer transition">
                Mock Interviews
              </li>
              <li className="hover:text-cyan-400 cursor-pointer transition">
                Performance
              </li>
              <li className="hover:text-cyan-400 cursor-pointer transition">
                Feedback
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-blue-500">
              Company
            </h4>
            <ul
              className={`space-y-2 text-sm ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <li className="hover:text-blue-500 cursor-pointer transition">
                About Us
              </li>
              <li className="hover:text-blue-500 cursor-pointer transition">
                Privacy Policy
              </li>
              <li className="hover:text-blue-500 cursor-pointer transition">
                Terms of Service
              </li>
            </ul>
          </div>

          {/* Socials Column */}
          <div className="space-y-4">
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-cyan-400">
              Socials
            </h4>
            <div className="flex gap-4">
              {[
                {
                  icon: <FaLinkedin />,
                  link: "https://linkedin.com/in/shraddhakodes",
                },
                {
                  icon: <FaGithub />,
                  link: "https://github.com/shraddhakodes",
                },
                {
                  icon: <FaTwitter />,
                  link: "https://twitter.com/shraddhakodes",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl transition-all ${
                    darkMode
                      ? "bg-slate-900 text-white hover:bg-cyan-600"
                      : "bg-slate-100 text-slate-700 hover:bg-cyan-500 hover:text-white"
                  }`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
            darkMode ? "border-slate-800" : "border-slate-100"
          }`}
        >
          <p className="text-xs font-medium text-slate-500">
            © {new Date().getFullYear()} InterVueX. Developed by{" "}
            <span className="text-cyan-400">Shraddha Kumari</span>
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter hover:text-blue-500 transition-all text-slate-500"
          >
            Back to top <FaArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;