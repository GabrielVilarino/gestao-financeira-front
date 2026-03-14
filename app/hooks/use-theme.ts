"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = stored || (prefersDark ? "dark" : "light");
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  function applyTheme(newTheme: Theme) {
    document.documentElement.style.setProperty(
      "--background",
      newTheme === "dark" ? "#0d1f0d" : "#ffffff"
    );
    document.documentElement.style.setProperty(
      "--foreground",
      newTheme === "dark" ? "#e8f5e8" : "#171717"
    );
  }

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  }

  return { theme, toggleTheme };
}
