import React, { useContext, useEffect, useState } from "react";
import { FaMoon, FaSun, FaBars, FaTimes, FaBrain } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => setDarkMode(!darkMode);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] backdrop-blur-md px-6 py-4 transition-all duration-300 border-b ${
          darkMode
            ? "bg-slate-950/80 text-white border-slate-800 shadow-xl"
            : "bg-white/80 text-slate-900 border-slate-200 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-black flex items-center gap-2 tracking-tighter"
          >
            <FaBrain className="text-3xl text-cyan-500" />
            <span>InterVueX</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8 font-bold text-sm uppercase tracking-widest">
              <li>
                <a
                  href="#home"
                  className="hover:text-cyan-500 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-cyan-500 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-cyan-500 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all ${
                darkMode
                  ? "bg-slate-800 text-yellow-400"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="hidden md:block px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden md:block px-5 py-2.5 bg-cyan-500 text-white text-sm font-bold rounded-xl hover:bg-cyan-600 transition"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden text-2xl p-2 rounded-lg hover:bg-slate-500/10"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      ></div>

      <div
        className={`fixed top-0 right-0 w-[300px] h-full z-[120] shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } ${darkMode ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-700/10">
          <span className="font-black tracking-tighter text-xl text-cyan-500">
            InterVueX
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-full hover:bg-slate-500/10"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <ul className="flex flex-col p-8 gap-6 text-lg font-bold">
          <li>
            <a
              href="#home"
              onClick={() => setMenuOpen(false)}
              className="hover:text-cyan-500"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="hover:text-cyan-500"
            >
              Features
            </a>
          </li>
          <li>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="hover:text-cyan-500"
            >
              Contact
            </a>
          </li>
          {isAuthenticated ? (
            <li>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-3.5 rounded-2xl font-black"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className="block text-center bg-cyan-500 text-white py-3.5 rounded-2xl font-black"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
