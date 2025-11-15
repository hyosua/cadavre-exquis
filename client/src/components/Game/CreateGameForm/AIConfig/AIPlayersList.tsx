import { Bot, Plus } from "lucide-react";
import { AIPlayersListProps } from "@/types/ai-config.type";
import { AIPlayerCard } from "./AIPlayerCard";
import { Button } from "@/components/ui/button";

export function AIPlayersList({
  aiPlayers,
  onAdd,
  onRemove,
  onCreativityChange,
  maxPlayers,
}: AIPlayersListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Joueurs IA</h3>
          <p className="text-sm text-muted-foreground">
            Ajoutez des adversaires contrôlés par l&apos;IA
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          disabled={aiPlayers.length >= maxPlayers}
          className="gap-2"
        >
          <Plus size={16} />
          Ajouter
        </Button>
      </div>

      {aiPlayers.length > 0 ? (
        <div className="space-y-2">
          {aiPlayers.map((ai) => (
            <AIPlayerCard
              key={ai.id}
              aiPlayer={ai}
              onRemove={onRemove}
              onCreativityChange={onCreativityChange}
            />
          ))}

          <p className="text-xs text-muted-foreground text-center pt-1">
            {aiPlayers.length} joueur{aiPlayers.length > 1 ? "s" : ""} IA
            {maxPlayers - aiPlayers.length > 0 &&
              ` · ${maxPlayers - aiPlayers.length} emplacement${
                maxPlayers - aiPlayers.length > 1 ? "s" : ""
              } restant${maxPlayers - aiPlayers.length > 1 ? "s" : ""}`}
          </p>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/30">
          <Bot className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">Aucun joueur IA</p>
          <p className="text-xs mt-1 text-muted-foreground/70">
            Ajoutez des joueurs IA pour jouer seul ou enrichir la partie !
          </p>
        </div>
      )}
    </div>
  );
}
