// components/Game/PhaseSteps.tsx
"use client";

interface PhaseStepsProps {
  phases: string[];
  currentPhase: number;
}

export function PhaseSteps({ phases, currentPhase }: PhaseStepsProps) {
  return (
    // Utilisez `flex` pour aligner les étapes et `overflow-x-auto` pour le mobile
    <div className="flex w-full items-start overflow-x-auto p-4">
      {phases.map((p, index) => (
        <div key={p} className="relative flex flex-1 flex-col items-center">
          {/* Ligne de connexion (sauf pour le premier élément) */}
          {index > 0 && (
            <div
              className={`absolute left-0 top-4 -z-10 h-1.5 w-full -translate-x-1/2
                ${
                  // Si l'étape est active ou passée, colore la ligne en 'primary'
                  index <= currentPhase ? "bg-primary" : "bg-muted"
                }
              `}
            />
          )}

          {/* Cercle de l'étape */}
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300
              ${
                index <= currentPhase
                  ? "bg-primary text-primary-foreground" // Style "passé" ou "actuel"
                  : "bg-muted text-muted-foreground" // Style "futur"
              }
            `}
          >
            {/* Vous pouvez mettre index + 1 si vous voulez des chiffres */}
            {index + 1}
          </div>

          {/* Label de l'étape */}
          <p
            className={`mt-2 text-center text-sm font-medium transition-colors duration-300
              ${
                index <= currentPhase
                  ? "text-primary" // Couleur du texte
                  : "text-muted-foreground"
              }
            `}
          >
            {p}
          </p>
        </div>
      ))}
    </div>
  );
}
