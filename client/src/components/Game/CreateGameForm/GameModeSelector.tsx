import { GamePreset } from "@/config/config";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PresetRadioItem } from "./PresetRadioItem";
import { groupedPresets, difficultyLabels } from "./config";

interface GameModeSelectorProps {
  control: any;
}

export const GameModeSelector = ({ control }: GameModeSelectorProps) => (
  <FormField
    control={control}
    name="presetId"
    render={({ field }) => (
      <FormItem className="space-y-3">
        <FormLabel className="text-lg font-semibold">Mode de jeu</FormLabel>
        <FormDescription>
          Choisissez un type de structure de phrase pour la partie.
        </FormDescription>
        <FormControl>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="w-full"
          >
            <Accordion
              type="multiple"
              defaultValue={["facile"]}
              className="w-full"
            >
              {Object.entries(groupedPresets).map(([difficulty, presets]) => (
                <AccordionItem key={difficulty} value={difficulty}>
                  <AccordionTrigger className="text-base">
                    {difficultyLabels[difficulty as GamePreset["difficulty"]]}
                  </AccordionTrigger>
                  <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                    {presets.map((preset) => (
                      <PresetRadioItem key={preset.id} preset={preset} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
