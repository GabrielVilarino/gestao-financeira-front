"use client";

import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "../app/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      {theme === "light" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Alternar tema"
        className={
          theme === "dark"
            ? "data-[state=checked]:bg-white"
            : "data-[state=unchecked]:bg-[#0d1f0d]"
        }
      />
    </div>
  );
}
