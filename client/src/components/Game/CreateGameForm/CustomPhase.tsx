// CustomPhaseSelector.tsx
// Sélecteur de phases par clic
import React, { useState, useEffect } from "react";
import { Control } from "react-hook-form";
import { Plus, X, ArrowRight, GripVertical } from "lucide-react";
import { PHASE_DETAILS } from "@/config/config";
import { PhaseDetail } from "@/types/game.type";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GameConfigValues } from "./config";

interface CustomPhasesSelectorProps {
  control: Control<GameConfigValues>;
}

interface Phase {
  id: string;
  detail: PhaseDetail;
}

export const CustomPhasesSelector = ({
  control,
}: CustomPhasesSelectorProps) => {
  return (
    <FormField
      control={control}
      name="phases"
      render={({ field }) => (
        <FormItem className="rounded-lg border bg-muted/30 p-4">
          <FormLabel className="text-lg font-semibold">
            Composition personnalisée
          </FormLabel>
          <FormDescription>
            Cliquez sur les éléments pour composer votre phrase dans
            l&apos;ordre souhaité
          </FormDescription>
          <PhaseBuilder value={field.value || []} onChange={field.onChange} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface PhaseBuilderProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const PhaseBuilder = ({ value, onChange }: PhaseBuilderProps) => {
  const [availablePhases, setAvailablePhases] = useState<Phase[]>([]);
  const [selectedPhases, setSelectedPhases] = useState<Phase[]>([]);
  const [draggedItem, setDraggedItem] = useState<Phase | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Initialisation
  useEffect(() => {
    const allPhases = Object.entries(PHASE_DETAILS).map(([key, detail]) => ({
      id: key,
      detail,
    }));

    if (value.length === 0) {
      setAvailablePhases(allPhases);
      setSelectedPhases([]);
    } else {
      const selected = value
        .map((key) => allPhases.find((p) => p.id === key))
        .filter((p): p is Phase => p !== undefined);

      const available = allPhases.filter((p) => !value.includes(p.id));

      setSelectedPhases(selected);
      setAvailablePhases(available);
    }
  }, []);

  // Synchroniser avec le formulaire
  useEffect(() => {
    const phaseIds = selectedPhases.map((p) => p.id);
    if (JSON.stringify(phaseIds) !== JSON.stringify(value)) {
      onChange(phaseIds);
    }
  }, [selectedPhases, onChange, value]);

  const addPhase = (phase: Phase) => {
    setAvailablePhases((prev) => prev.filter((p) => p.id !== phase.id));
    setSelectedPhases((prev) => [...prev, phase]);
  };

  const removePhase = (phase: Phase) => {
    setSelectedPhases((prev) => prev.filter((p) => p.id !== phase.id));
    setAvailablePhases((prev) => [...prev, phase]);
  };

  // Drag & drop pour réorganiser
  const handleDragStart = (phase: Phase) => {
    setDraggedItem(phase);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!draggedItem) return;

    const currentIndex = selectedPhases.findIndex(
      (p) => p.id === draggedItem.id
    );
    if (currentIndex === dropIndex) return;

    const newSelected = [...selectedPhases];
    newSelected.splice(currentIndex, 1);
    const adjustedIndex = dropIndex > currentIndex ? dropIndex - 1 : dropIndex;
    newSelected.splice(adjustedIndex, 0, draggedItem);

    setSelectedPhases(newSelected);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4 pt-3">
      {/* Zone de composition */}
      <div className="rounded-lg border-2 border-dashed border-primary/30 bg-background p-4 min-h-32">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Ma composition
          </h4>
          {selectedPhases.length > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {selectedPhases.length} élément
              {selectedPhases.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {selectedPhases.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <p className="text-sm font-medium">Aucun élément sélectionné</p>
              <p className="text-xs mt-1">
                Cliquez sur les éléments ci-dessous pour composer
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedPhases.map((phase, index) => (
              <React.Fragment key={phase.id}>
                {dragOverIndex === index && (
                  <div className="w-1 bg-primary rounded-full self-stretch animate-pulse" />
                )}
                <div
                  draggable
                  onDragStart={() => handleDragStart(phase)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group relative flex items-center gap-2 pl-2 pr-2 py-2 rounded-lg border bg-card shadow-sm hover:shadow-md transition-all cursor-move ${
                    draggedItem?.id === phase.id ? "opacity-50 scale-95" : ""
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {index + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm leading-tight">
                      {phase.detail.titre}
                    </span>
                    <span className="text-xs text-muted-foreground italic leading-tight">
                      {phase.detail.helper}
                    </span>
                  </div>
                  {index < selectedPhases.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-muted-foreground/40 ml-1" />
                  )}
                  <button
                    type="button"
                    onClick={() => removePhase(phase)}
                    className="ml-2 p-1 hover:bg-destructive/10 rounded transition-colors"
                    aria-label="Retirer"
                  >
                    <X className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
                {dragOverIndex === index + 1 &&
                  index === selectedPhases.length - 1 && (
                    <div className="w-1 bg-primary rounded-full self-stretch animate-pulse" />
                  )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Phases disponibles */}
      <div className="rounded-lg border bg-background/50 p-4">
        <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
          Éléments disponibles
        </h4>

        {availablePhases.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            Tous les éléments ont été ajoutés ✓
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {availablePhases.map((phase) => (
              <button
                key={phase.id}
                type="button"
                onClick={() => addPhase(phase)}
                className="group text-left p-3 rounded-lg border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                      {phase.detail.titre}
                    </div>
                    <div className="text-xs text-muted-foreground italic line-clamp-2">
                      {phase.detail.helper}
                    </div>
                  </div>
                  <div className="flex-shrink-0 p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-3.5 h-3.5 text-primary" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-xs text-muted-foreground bg-muted/50 rounded p-3">
        <p>
          💡 <strong>Cliquez</strong> sur un élément pour l&apos;ajouter •{" "}
          <strong>Glissez-déposez</strong> dans la composition pour réorganiser
        </p>
      </div>
    </div>
  );
};
