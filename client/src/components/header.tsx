import { ModeToggle } from "@/components/ui/toggle-mode";

export function Header() {
  return (
    <header className="fixed top-4 right-4 flex justify-between items-center">
      <ModeToggle />
    </header>
  );
}
