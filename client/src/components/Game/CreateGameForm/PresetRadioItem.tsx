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
        "hover:text-primary hover:text-lg hover:font-bold transition-all",
        "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:text-primary"
      )}
    >
      <span className="font-semibold mb-1">{preset.name}</span>
      <span className="text-sm text-muted-foreground">
        <em>&quot;{preset.example}&quot;</em>
      </span>
    </Label>
  </FormItem>
);
