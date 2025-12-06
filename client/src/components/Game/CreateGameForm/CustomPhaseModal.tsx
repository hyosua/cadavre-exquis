// CustomPhaseModal.tsx
// Modal pour la composition personnalisée
import React, { useState, useEffect } from "react";
import { Control, useFormContext } from "react-hook-form";
import { X, GripVertical, Ellipsis } from "lucide-react";
import { PHASE_DETAILS } from "@/config/config";
import { PhaseDetail } from "@/types/game.type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GameConfigValues } from "./config";

interface CustomPhaseModalProps {
  control: Control<GameConfigValues>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Phase {
  id: string;
  detail: PhaseDetail;
}

export const CustomPhaseModal = ({
  open,
  onOpenChange,
}: CustomPhaseModalProps) => {
  const { getValues, setValue } = useFormContext<GameConfigValues>();
  const [tempPhases, setTempPhases] = useState<string[]>([]);

  // Synchroniser avec les phases actuelles quand le modal s'ouvre
  useEffect(() => {
    if (open) {
      const currentPhases = getValues("phases") || [];
      setTempPhases(currentPhases);
    }
  }, [open, getValues]);

  const handleSave = () => {
    // Mettre à jour le formulaire avec les phases temporaires
    setValue("phases", tempPhases, { shouldValidate: true, shouldDirty: true });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="pop-card max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-foreground p-0 gap-0">
        <DialogHeader className="p-6 pb-2 bg-primary/70 border-b-2 border-foreground/5">
          <DialogTitle className="text-2xl font-averia">
            Créez votre structure
          </DialogTitle>
          <DialogDescription>
            Cliquez pour ajouter, Glissez-déposez pour déplacer.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <PhaseBuilder value={tempPhases} onChange={setTempPhases} />
        </div>

        <DialogFooter className="p-6 bg-muted/30 border-t-2 border-foreground/5 gap-3 sm:gap-0">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={tempPhases.length === 0}
            className="pop-btn text-primary-foreground"
          >
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

  // Initialisation et synchronisation
  useEffect(() => {
    const allPhases = Object.entries(PHASE_DETAILS).map(([key, detail]) => ({
      id: key,
      detail,
    }));

    const selected = value
      .map((key) => allPhases.find((p) => p.id === key))
      .filter((p): p is Phase => p !== undefined);

    const available = allPhases.filter((p) => !value.includes(p.id));

    setSelectedPhases(selected);
    setAvailablePhases(available);
  }, [value]);

  const addPhase = (phase: Phase) => {
    const newPhases = [...value, phase.id];
    onChange(newPhases);
  };

  const removePhase = (phase: Phase) => {
    const newPhases = value.filter((id) => id !== phase.id);
    onChange(newPhases);
  };

  // Drag & drop pour réorganiser
  const handleDragStart = (phase: Phase) => {
    setDraggedItem(phase);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!draggedItem) return;

    const currentIndex = value.indexOf(draggedItem.id);

    // Ajuster l'index de drop si nécessaire
    let adjustedDropIndex = dropIndex;
    if (dropIndex > currentIndex) {
      adjustedDropIndex = dropIndex - 1;
    }

    if (currentIndex === adjustedDropIndex) return;

    const newPhases = [...value];
    newPhases.splice(currentIndex, 1);
    newPhases.splice(adjustedDropIndex, 0, draggedItem.id);

    onChange(newPhases);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Zone de composition */}
      <div className="relative rounded-lg border-2 border-dashed border-foreground/30 bg-muted/20 p-4 min-h-40">
        <div className="absolute -top-3 left-4 bg-background px-2 text-sm font-bold text-foreground/60 uppercase tracking-widest">
          Votre Phrase
        </div>

        {selectedPhases.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-10 opacity-40">
            <div className="border-2 border-dashed border-foreground p-4 rounded-lg mb-2 rotate-3">
              <Ellipsis className="w-8 h-8" />
            </div>
            <p className="font-averia text-lg">Déposez des éléments ici !</p>
          </div>
        ) : (
          <div
            className="space-y-2 pb-2"
            onDragOver={(e) => {
              e.preventDefault();
              // Détecte si on est en dessous du dernier élément
              const container = e.currentTarget;
              const items = Array.from(container.children).filter(
                (child) => child.getAttribute("data-phase-item") === "true"
              );
              const lastChild = items[items.length - 1];
              if (lastChild) {
                const lastRect = lastChild.getBoundingClientRect();
                if (e.clientY > lastRect.bottom + 8) {
                  setDragOverIndex(selectedPhases.length);
                }
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              // Permet de déposer à la fin
              const container = e.currentTarget;
              const items = Array.from(container.children).filter(
                (child) => child.getAttribute("data-phase-item") === "true"
              );
              const lastChild = items[items.length - 1];
              if (lastChild) {
                const lastRect = lastChild.getBoundingClientRect();
                if (e.clientY > lastRect.bottom + 8) {
                  handleDrop(e, selectedPhases.length);
                }
              }
            }}
            onDragLeave={(e) => {
              // Ne réinitialiser que si on quitte vraiment le conteneur
              if (e.currentTarget === e.target) {
                setDragOverIndex(null);
              }
            }}
          >
            {selectedPhases.map((phase, index) => (
              <div
                key={phase.id}
                data-phase-item="true"
                className="relative"
                onDragOver={(e) => {
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const midPoint = rect.top + rect.height / 2;
                  const dropIndex = e.clientY < midPoint ? index : index + 1;
                  setDragOverIndex(dropIndex);
                }}
                onDragLeave={handleDragLeave}
                onDrop={(e) => {
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const midPoint = rect.top + rect.height / 2;
                  const dropIndex = e.clientY < midPoint ? index : index + 1;
                  handleDrop(e, dropIndex);
                }}
              >
                {/* Indicateur de drop au-dessus */}
                {dragOverIndex === index && (
                  <div className="absolute -top-1 left-0 right-0 h-2 flex items-center z-10">
                    <div className="h-1 w-full bg-primary rounded-full animate-pulse shadow-lg" />
                  </div>
                )}

                <div
                  draggable
                  onDragStart={() => handleDragStart(phase)}
                  onDragEnd={handleDragEnd}
                  className={`
                    group relative flex items-center gap-2 p-2 px-3 rounded-lg border-2 border-foreground bg-white text-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] cursor-grab active:cursor-grabbing hover:-translate-y-0.5 transition-transform
                    ${draggedItem?.id === phase.id ? "opacity-20" : ""}
                  `}
                >
                  <GripVertical className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm font-averia">
                      {phase.detail.titre}
                    </div>
                    <div className="text-xs text-muted-foreground italic truncate">
                      {phase.detail.helper}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhase(phase)}
                    className="flex-shrink-0 p-1.5 hover:bg-destructive/10 rounded transition-colors"
                    aria-label="Retirer"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>

                {/* Indicateur de drop en-dessous */}
                {dragOverIndex === index + 1 && (
                  <div className="absolute -bottom-1 left-0 right-0 h-2 flex items-center z-10">
                    <div className="h-1 w-full bg-primary rounded-full animate-pulse shadow-lg" />
                  </div>
                )}
              </div>
            ))}

            {/* Zone de drop après le dernier élément */}
            {dragOverIndex === selectedPhases.length && (
              <div className="pt-2 flex items-center">
                <div className="h-1 w-full bg-primary rounded-full animate-pulse shadow-lg" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Phases disponibles */}
      <div className="rounded-lg border bg-background p-4">
        <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
          <span className="text-xl">📚</span> Éléments grammaticaux
        </h4>

        {availablePhases.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Tous les éléments ont été ajoutés ✓
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2">
            {availablePhases.map((phase) => (
              <button
                key={phase.id}
                type="button"
                onClick={() => addPhase(phase)}
                className="text-left p-3 rounded-lg border-2 border-transparent bg-card hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm hover:translate-1 transition-all active:scale-95 group"
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
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
