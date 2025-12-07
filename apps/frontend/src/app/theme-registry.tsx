"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext({
  theme: "light" as Theme,
  toggleTheme: () => {},
});

export function ThemeRegistry({
  children,
  initialTheme = "light",
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  // 1️⃣ Run only on client — sync localStorage theme *without causing mismatch*
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme | null) ?? initialTheme;

    // Only update if different
    if (saved !== theme) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, [initialTheme]);

  // 2️⃣ Toggle theme + sync cookie + localStorage
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";

    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);

    // Sync for next client load
    localStorage.setItem("theme", next);

    // Sync for next SERVER SSR render
    document.cookie = `theme=${next}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
