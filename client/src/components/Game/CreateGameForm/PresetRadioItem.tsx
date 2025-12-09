import { GamePreset } from "@/config/config";
import { cn } from "@/lib/utils";
import { FormControl, FormItem } from "@/components/ui/form";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PresetRadioItemProps {
  preset: GamePreset;
  customTitle?: string;
  customDescription?: string;
  onClick?: () => void;
}

export const PresetRadioItem = ({
  preset,
  customTitle,
  customDescription,
  onClick,
}: PresetRadioItemProps) => (
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
      onClick={onClick}
      className={cn(
        "flex flex-col rounded-lg border-2 p-4 cursor-pointer",
        "hover:bg-primary/20 transition-all",
        "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20",
        "peer-data-[state=checked]:shadow-lg peer-data-[state=checked]:shadow-primary/20",
        "[&:has([data-state=checked])]:border-primary",
        "peer-data-[state=checked]:text-primary"
      )}
    >
      <span
        className={cn(
          "font-semibold text-lg sm:text-xl mb-1 transition-colors"
        )}
      >
        {/*On affiche le titre du preset personnalisé sinon preset normal*/}
        {customTitle || preset.name}
      </span>
      <span className="text-md sm:text-lg text-muted-foreground ">
        <em>&quot;{customDescription || preset.example}&quot;</em>
      </span>
    </Label>
  </FormItem>
);
