// CustomPhaseModal.tsx
// Modal pour la composition personnalisée
import React, { useState, useEffect } from "react";
import { Control, useFormContext } from "react-hook-form";
import { Plus, X, GripVertical } from "lucide-react";
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Composez votre structure personnalisée</DialogTitle>
          <DialogDescription>
            Cliquez pour ajouter des éléments, glissez-déposez pour réorganiser
          </DialogDescription>
        </DialogHeader>

        <PhaseBuilder value={tempPhases} onChange={setTempPhases} />

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={tempPhases.length === 0}>
            Valider ({tempPhases.length} élément
            {tempPhases.length > 1 ? "s" : ""})
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

    const currentIndex = value.indexOf(draggedItem.id);
    if (currentIndex === dropIndex) return;

    const newPhases = [...value];
    newPhases.splice(currentIndex, 1);
    const adjustedIndex = dropIndex > currentIndex ? dropIndex - 1 : dropIndex;
    newPhases.splice(adjustedIndex, 0, draggedItem.id);

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
      <div className="rounded-lg border-2 border-dashed border-primary/30 bg-muted/30 p-4 min-h-40">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="text-sm font-semibold">Ma composition</h4>
          {selectedPhases.length > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {selectedPhases.length} élément
              {selectedPhases.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {selectedPhases.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <div className="text-center">
              <p className="text-sm font-medium">Aucun élément sélectionné</p>
              <p className="text-xs mt-1">
                Cliquez sur les éléments ci-dessous
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedPhases.map((phase, index) => (
              <React.Fragment key={phase.id}>
                {dragOverIndex === index && (
                  <div className="h-1 bg-primary rounded-full animate-pulse" />
                )}
                <div
                  draggable
                  onDragStart={() => handleDragStart(phase)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-move ${
                    draggedItem?.id === phase.id
                      ? "opacity-50 scale-[0.98]"
                      : ""
                  }`}
                >
                  <GripVertical className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
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
                {dragOverIndex === index + 1 &&
                  index === selectedPhases.length - 1 && (
                    <div className="h-1 bg-primary rounded-full animate-pulse" />
                  )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Phases disponibles */}
      <div className="rounded-lg border bg-background p-4">
        <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
          Éléments disponibles
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
                className="group text-left p-3 rounded-lg border bg-card text-card-foreground hover:border-primary/50 hover:bg-primary/5 transition-all hover:shadow-sm"
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
      <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 space-y-1">
        <p>
          💡 <strong>Cliquez</strong> sur un élément pour l&apos;ajouter
        </p>
        <p>
          🔄 <strong>Glissez-déposez</strong> dans la composition pour
          réorganiser
        </p>
      </div>
    </div>
  );
};
