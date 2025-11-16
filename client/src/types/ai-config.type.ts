import { Personnality, AIPlayer } from "./game.type";

export interface AIPlayerConfigProps {
  aiPlayer: AIPlayer;
  onRemove: (id: string) => void;
  onPersonnalityChange: (id: string, personnality: Personnality) => void;
}

export interface AIPlayersListProps {
  aiPlayers: AIPlayer[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onPersonnalityChange: (id: string, personnality: Personnality) => void;
  maxPlayers: number;
}