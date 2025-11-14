import { GamePreset } from "@/config/config";
import { cn } from "@/lib/utils";
import { FormControl, FormItem } from "@/components/ui/form";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PresetRadioItemProps {
  preset: GamePreset;
}

export const PresetRadioItem = ({ preset }: PresetRadioItemProps) => (
  <FormItem>
    <FormControl>
      <RadioGroupItem
        value={preset.id}
        id={preset.id}
        className="peer sr-only"
      />
    </FormControl>
    <Label
      htmlFor={preset.id}
      className={cn(
        "flex flex-col rounded-lg border-2 p-4 cursor-pointer",
        "hover:bg-primary/20 transition-all",
        "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20",
        "peer-data-[state=checked]:shadow-lg peer-data-[state=checked]:shadow-primary/20",
        "[&:has([data-state=checked])]:border-primary",
        "peer-data-[state=checked]:text-primary"
      )}
    >
      <span className={cn("font-semibold mb-1 transition-colors")}>
        {preset.name}
      </span>
      <span className="text-sm text-muted-foreground ">
        <em>&quot;{preset.example}&quot;</em>
      </span>
    </Label>
  </FormItem>
);
