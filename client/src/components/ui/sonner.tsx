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
      className="toaster group"
      // Position "top-center" est souvent mieux pour un jeu
      position="top-center"
      // On personnalise les icônes avec un trait un peu plus épais pour le style cartoon
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
          // LA CARTE PRINCIPALE (Style Pop-Card)
          toast: `
            group toast 
            group-[.toaster]:bg-card 
            group-[.toaster]:text-foreground 
            group-[.toaster]:border-2 
            group-[.toaster]:border-foreground 
            group-[.toaster]:shadow-[4px_4px_0px_0px_oklch(var(--foreground))] 
            group-[.toaster]:rounded-xl 
            group-[.toaster]:font-averia 
            group-[.toaster]:p-4
            group-[.toaster]:items-start
          `,

          // LE TEXTE DE DESCRIPTION
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:font-sans",

          // BOUTON D'ACTION (Style Pop-Btn Primary)
          actionButton: `
            group-[.toast]:bg-primary 
            group-[.toast]:text-primary-foreground 
            group-[.toast]:border-2 
            group-[.toast]:border-foreground 
            group-[.toast]:shadow-[2px_2px_0px_0px_oklch(var(--foreground))] 
            group-[.toast]:font-bold 
            group-[.toast]:active:translate-y-[2px] 
            group-[.toast]:active:shadow-none
          `,

          // BOUTON ANNULER (Style Pop-Btn Ghost)
          cancelButton: `
            group-[.toast]:bg-muted 
            group-[.toast]:text-foreground 
            group-[.toast]:border-2 
            group-[.toast]:border-foreground 
            group-[.toast]:font-bold
          `,

          // VARIANTES DE COULEUR (Optionnel : teinte légèrement le fond selon le type)
          error:
            "group-[.toaster]:bg-red-50 group-[.toaster]:text-red-900 dark:group-[.toaster]:bg-red-950 dark:group-[.toaster]:text-red-50",
          success:
            "group-[.toaster]:bg-green-50 group-[.toaster]:text-green-900 dark:group-[.toaster]:bg-green-950 dark:group-[.toaster]:text-green-50",
          warning:
            "group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-900 dark:group-[.toaster]:bg-yellow-950 dark:group-[.toaster]:text-yellow-50",
          info: "group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-900 dark:group-[.toaster]:bg-blue-950 dark:group-[.toaster]:text-blue-50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
