"use client";

import { useTheme } from "@/app/theme-registry";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-lg border border-border bg-card text-app flex gap-2 items-center hover:opacity-80 transition"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </button>
  );
}
