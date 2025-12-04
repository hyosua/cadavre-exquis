// store/gameStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Game, Player } from '@/types/game.type';

interface GameState {
  game: Game | null;            
  currentPlayer: Player | null; 
  persistedGameRef: { id: string; code?: string } | null; 
  timeLeft: number;
  error: string | null;
  isConnected: boolean;
  onGameCreated: ((gameId: string) => void) | null;

  // hydration flag
  hasHydrated: boolean;

  setGame: (game: Game | null) => void;
  setCurrentPlayer: (player: Player | null) => void;
  setPersistedGameRef: (ref: { id: string; code?: string } | null) => void;
  setTimeLeft: (time: number) => void;
  setError: (error: string | null) => void;
  setIsConnected: (connected: boolean) => void;
  setOnGameCreated: (callback: ((gameId: string) => void) | null) => void;
  resetGame: () => void;
  leaveGame: () => void;
  updatePlayerStatus: (playerId: string, status: 'thinking' | 'played') => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      game: null,
      currentPlayer: null,
      persistedGameRef: null,
      timeLeft: 0,
      error: null,
      isConnected: false,
      onGameCreated: null,
      hasHydrated: false,

      setGame: (game) => {
        set({ game });
        // Si le serveur envoie un game, mets à jour la ref persistée
        if ( ! game?.id) {
          set({ persistedGameRef: null})
          return
        }

        if(game.status === "finished"){
          set({ persistedGameRef: null})
        } else { // sauvegarde en localstorage pour pouvoir rejoin
          set({ persistedGameRef: { id: game.id, code: (game as Game).code } });
        }

      },
      updatePlayerStatus: (playerId, status) => {
        set((state) => {
          if (!state.game) return {};

          const updatedPlayers = state.game.players.map((p) => {
            if (p.id === playerId) {
              return {
                ...p,
                // Si 'thinking', on active le flag visuel
                isThinking: status === 'thinking',
                // Si 'played', on valide la phase (ce que le client regarde)
                hasPlayedCurrentPhase: status === 'played' ? true : p.hasPlayedCurrentPhase,
              };
            }
            return p;
          });

          return {
            game: {
              ...state.game,
              players: updatedPlayers,
            },
          };
        });
      },
      setCurrentPlayer: (player) =>
        set({ currentPlayer: player ? player : null }),

      setPersistedGameRef: (ref) => set({ persistedGameRef: ref }),
      setTimeLeft: (time) => set({ timeLeft: time }),
      setError: (error) => set({ error }),
      setIsConnected: (connected) => set({ isConnected: connected }),
      setOnGameCreated: (callback) => set({ onGameCreated: callback }),
      leaveGame: () => set({game: null, persistedGameRef: null, timeLeft: 0, error: null, onGameCreated: null}),
      
      resetGame: () =>
        set({
          game: null,
          currentPlayer: null,
          persistedGameRef: null,
          timeLeft: 0,
          error: null,
          onGameCreated: null,
        }),
    }),
    {
      name: 'game-store',
      storage: createJSONStorage(() => localStorage),
      // On ne persiste que ce qui sert à rejoin
      partialize: (s) => ({
        currentPlayer: s.currentPlayer,        // {id, pseudo}
        persistedGameRef: s.persistedGameRef,  // {id, code?}
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    }
  )
);
