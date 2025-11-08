// GameModeSelector.tsx
import { useState, useMemo } from "react";
import { Control } from "react-hook-form";
import { GAME_PRESETS, GamePreset } from "@/config/config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { GameConfigValues, groupedPresets, difficultyLabels } from "./config";
import { PresetRadioItem } from "./PresetRadioItem";
import { CustomPhaseModal } from "./CustomPhaseModal";

interface GameModeSelectorProps {
  control: Control<GameConfigValues>;
}

export const GameModeSelector = ({ control }: GameModeSelectorProps) => {
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const selectedPresetId = control._formValues.presetId;
  // Trouve la difficulté du preset sélectionné
  const defaultAccordionValue = useMemo(() => {
    const selectedPreset = GAME_PRESETS.find((p) => p.id === selectedPresetId);
    return selectedPreset ? [selectedPreset.difficulty] : ["facile"];
  }, [selectedPresetId]);

  return (
    <>
      <FormField
        control={control}
        name="presetId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">Mode de jeu</FormLabel>
            <FormDescription>
              Choisissez une structure de phrase prédéfinie ou créez la vôtre
            </FormDescription>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value === "custom") {
                    setCustomModalOpen(true);
                  }
                }}
                defaultValue={field.value}
                value={field.value}
              >
                <Accordion
                  type="multiple"
                  defaultValue={defaultAccordionValue}
                  className="w-full space-y-2"
                >
                  {/* Accordéons par difficulté */}
                  {Object.entries(groupedPresets).map(
                    ([difficulty, presets]) => (
                      <AccordionItem
                        key={difficulty}
                        value={difficulty}
                        className={``}
                      >
                        <AccordionTrigger className="text-base">
                          {
                            difficultyLabels[
                              difficulty as GamePreset["difficulty"]
                            ]
                          }
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 space-y-2">
                          {presets.map((preset) => (
                            <PresetRadioItem key={preset.id} preset={preset} />
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />

      <CustomPhaseModal
        control={control}
        open={customModalOpen}
        onOpenChange={setCustomModalOpen}
      />
    </>
  );
};
