// CustomPhaseSelector
// Selecteur de Modes
import { PHASE_DETAILS } from "@/config/config";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhaseCheckbox } from "./PhaseCheckbox";
import { Control } from "react-hook-form";

interface CustomPhasesSelectorProps {
  control: Control;
}

export const CustomPhasesSelector = ({
  control,
}: CustomPhasesSelectorProps) => (
  <FormField
    control={control}
    name="phases"
    render={() => (
      <FormItem className="rounded-lg border bg-muted/30 p-4">
        <FormLabel className="text-lg font-semibold">
          Composition personnalisée
        </FormLabel>
        <FormDescription>
          Cochez les éléments qui composeront la phrase finale.
        </FormDescription>
        <div className="space-y-3 pt-3">
          {Object.entries(PHASE_DETAILS).map(([key, detail]) => (
            <FormField
              key={key}
              control={control}
              name="phases"
              render={({ field }) => (
                <PhaseCheckbox phaseKey={key} detail={detail} field={field} />
              )}
            />
          ))}
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);
