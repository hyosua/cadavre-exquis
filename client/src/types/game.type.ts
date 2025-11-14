export type GameStatus = 'waiting' | 'playing' | 'voting' | 'finished';

export interface PhaseDetail {
  titre: string;
  helper: string;
  placeholder: string;
}

export interface GameConfig {
  phases: string[];
  phaseDetails: Record<string, PhaseDetail>;
  timePerPhase: number;
}

export interface Player {
  id: string;
  socketId: string;
  pseudo: string;
  isHost: boolean;
  isAi: boolean;
  hasPlayedCurrentPhase: boolean;
  isConnected: boolean;
  disconnectedAt?: number;
  gameId?: string;
}

export interface Sentence {
  id: string;
  words: string[];
  currentPlayerId: string;
}

// Pour l'affichage des votes, pas besoin de currentPlayerId
type FinalSentence = Omit<Sentence, 'currentPlayerId'>;

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

export interface RankingEntry {
  sentence: FinalSentence;
  voteCount: number;
  words: string[];
}