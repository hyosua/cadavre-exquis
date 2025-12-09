import { Plus } from "lucide-react";
import { AIPlayersListProps } from "@/types/ai-config.type";
import { AIPlayerCard } from "./AIPlayerCard";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";

export function AIPlayersList({
  aiPlayers,
  onAdd,
  ...props
}: AIPlayersListProps) {
  return (
    <div className="space-y-4 bg-muted/20 p-4 rounded-xl border-2 border-dashed border-foreground/10">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          onClick={onAdd}
          disabled={aiPlayers.length >= 3}
          // Petite variante pop-btn
          className="pop-btn h-8 sm:h-10 text-xs sm:text-lg px-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 border-2"
        >
          <Plus size={14} className="mr-1" /> Ajouter
        </Button>
      </div>

      <div className="space-y-2 min-h-[4rem]">
        <AnimatePresence>
          {aiPlayers.map((ai) => (
            <AIPlayerCard key={ai.id} aiPlayer={ai} {...props} />
          ))}
        </AnimatePresence>

        {aiPlayers.length === 0 && (
          <div className="text-center py-4 opacity-50 font-averia text-sm sm:text-lg">
            Pas d&apos;amis ? Ajoutez des robots ! 🤖
          </div>
        )}
      </div>
    </div>
  );
}
