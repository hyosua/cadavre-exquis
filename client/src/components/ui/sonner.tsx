"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--error-bg": "var(--destructive)",
          "--error-text": "var(--destructive-foreground)",
          "--error-border": "var(--destructive)",

          /* Fond et texte pour SUCCÈS (utilise nos nouvelles variables) */
          "--success-bg": "oklch(var(--success))",
          "--success-text": "oklch(var(--success-foreground))",
          "--success-border": "oklch(var(--success))",

          /* Fond et texte pour AVERTISSEMENT */
          "--warning-bg": "oklch(var(--warning))",
          "--warning-text": "oklch(var(--warning-foreground))",
          "--warning-border": "oklch(var(--warning))",

          /* Fond et texte pour INFO */
          "--info-bg": "oklch(var(--info))",
          "--info-text": "oklch(var(--info-foreground))",
          "--info-border": "oklch(var(--info))",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
