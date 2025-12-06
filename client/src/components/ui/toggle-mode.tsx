"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      // Le style magique
      className="rounded-full w-10 h-10 lg:border-2 lg:border-foreground bg-card hover:bg-accent hover:text-accent-foreground shadow-[2px_2px_0px_0px_oklch(var(--foreground))] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " />
      ) : (
        <Moon className=" h-[1.2rem] w-[1.2rem] scale-100 transition-all dark:rotate-0 dark:scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
