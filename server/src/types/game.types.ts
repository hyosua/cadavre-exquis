export type GameStatus = 'waiting' | 'playing' | 'voting' | 'finished';
export const PHASES = ["s", "adj", "v", "cod", "cc"] as const;
export type PhaseKey = (typeof PHASES)[number];

export interface phaseDetail {
  titre: string;
  helper: string;
  placeholder: string;
}

export interface GameConfig {
  phases: PhaseKey[];
  phaseDetails: Record<PhaseKey, phaseDetail>;
  timePerPhase: number;
}
export interface Player {
  id: string;
  socketId: string;
  pseudo: string;
  isHost: boolean;
  hasPlayedCurrentPhase: boolean;
  isConnected: boolean;
}

export interface Sentence {
  id: string;
  words: string[];
  currentPlayerId: string;
}

export interface Vote {
  playerId: string;
  sentenceId: string;
}

export interface Game {
  id: string;
  code: string;
  hostId: string;
  status: GameStatus;
  config: GameConfig;
  currentPhase: number;
  phaseStartTime: number;
  players: Player[];
  sentences: Sentence[];
  votes: Vote[];
  createdAt: number;
}