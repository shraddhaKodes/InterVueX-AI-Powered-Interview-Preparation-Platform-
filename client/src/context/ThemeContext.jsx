import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.toggle("dark", darkMode);
    window.localStorage.setItem("darkMode", darkMode.toString());

    body.style.backgroundColor = darkMode ? "#050816" : "#f8fafc";
    body.style.color = darkMode ? "#f8fafc" : "#0f172a";
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
