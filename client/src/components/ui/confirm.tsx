import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";

type ConfirmProps = {
  message?: string;
  onConfirm?: () => void;
  buttonName?: string | ReactNode;
  disableCondition?: boolean;
} & React.ComponentProps<typeof Button>;

export function Confirm({
  message = "Cette action est irréversible",
  buttonName = "Valider",
  disableCondition = false,
  variant = "outline",
  size = "default",
  className,
  onConfirm,
  ...buttonProps
}: ConfirmProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={disableCondition}
          {...buttonProps}
        >
          {buttonName}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continuer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
