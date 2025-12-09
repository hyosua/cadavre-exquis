"use client";

import { Check, Info, Loader2, X, TriangleAlert } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))]"
      position="top-center"
      icons={{
        success: <Check className="size-5 text-green-600" strokeWidth={3} />,
        info: <Info className="size-5 text-blue-600" strokeWidth={3} />,
        warning: (
          <TriangleAlert className="size-5 text-orange-500" strokeWidth={3} />
        ),
        error: <X className="size-5 text-red-600" strokeWidth={3} />,
        loading: (
          <Loader2
            className="size-5 text-muted-foreground animate-spin"
            strokeWidth={3}
          />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: `
            !bg-[hsl(var(--card))]
            !text-foreground
            !border-2
            !border-foreground
            !shadow-[4px_4px_0px_0px_oklch(var(--foreground))]
            !rounded-xl
            !font-averia
            !p-6
            !text-xl
            !leading-relaxed
            flex
            items-center
            justify-center
            gap-3
          `,
          error: `
            !bg-red-50 !text-red-900 
            dark:!bg-red-50 dark:!text-red-950
          `,
          success: `
            !bg-green-50 !text-green-900 
            dark:!bg-green-50 dark:!text-green-950
          `,
          warning: `
            !bg-yellow-50 !text-yellow-900 
            dark:!bg-yellow-50 dark:!text-yellow-950
          `,
          info: `
            !bg-blue-50 !text-blue-900 
            dark:!bg-blue-50 dark:!text-blue-950
          `,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
