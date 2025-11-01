// components/Game/PhaseSteps.tsx
"use client";

interface PhaseStepsProps {
  phases: string[];
  currentPhase: number;
}

export function PhaseSteps({ phases, currentPhase }: PhaseStepsProps) {
  return (
    <>
      <style jsx>{`
        .step::before,
        .step::after {
          transition: all 0.5s ease-in-out !important;
        }
      `}</style>

      <ul className="steps mt-8">
        {phases.map((p, index) => (
          <li
            key={p}
            className={`step ease-in-out transition-all duration-500 ${
              index <= currentPhase ? "step-primary" : "step-neutral"
            }`}
          >
            {p}
          </li>
        ))}
      </ul>
    </>
  );
}
