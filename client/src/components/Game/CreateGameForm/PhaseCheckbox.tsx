import { PhaseDetail } from "@/types/game.type";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface PhaseCheckboxProps {
  phaseKey: string;
  detail: PhaseDetail;
  field: {
    value: string[];
    onChange: (value: string[]) => void;
  };
}

export const PhaseCheckbox = ({
  phaseKey,
  detail,
  field,
}: PhaseCheckboxProps) => {
  const handleChange = (checked: boolean) => {
    field.onChange(
      checked
        ? [...field.value, phaseKey]
        : field.value.filter((id) => id !== phaseKey)
    );
  };

  return (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border bg-background p-4">
      <FormControl>
        <Checkbox
          checked={field.value?.includes(phaseKey)}
          onCheckedChange={handleChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel className="font-normal">{detail.titre}</FormLabel>
        <FormDescription>
          <em>&quot;{detail.helper}&quot;</em>
        </FormDescription>
      </div>
    </FormItem>
  );
};
