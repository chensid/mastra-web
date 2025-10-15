import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes = ["light", "dark", "system"] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="size-4" />;
      case "dark":
        return <Moon className="size-4" />;
      case "system":
        return <Monitor className="size-4" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={cycleTheme}
      aria-label="Toggle theme"
    >
      {getIcon()}
    </Button>
  );
}
