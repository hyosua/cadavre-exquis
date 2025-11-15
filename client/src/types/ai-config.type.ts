import { AICreativity, AIPlayer } from "./game.type";

export interface AIPlayerConfigProps {
  aiPlayer: AIPlayer;
  onRemove: (id: string) => void;
  onCreativityChange: (id: string, creativity: AICreativity) => void;
}

export interface AIPlayersListProps {
  aiPlayers: AIPlayer[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onCreativityChange: (id: string, creativity: AICreativity) => void;
  maxPlayers: number;
}