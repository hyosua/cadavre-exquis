import React from 'react';
import { Player } from '@/types/game.type';
import { motion } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import { X } from 'lucide-react';
import { Confirm } from '../ui/confirm';

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
  showPlayedStatus?: boolean;
}


export function PlayerList({ players, currentPlayerId, showPlayedStatus = false }: PlayerListProps) {
  const { kickPlayer, currentPlayer } = useGame();

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral border border-gray-600 rounded-lg shadow-[0_8px_34px_-6px_rgba(34,211,238,0.15)] p-4"
    >
      <h3 className="text-lg font-semibold mb-3">Joueurs ({players.length})</h3>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-2 rounded ${
              player.id === currentPlayerId
                ? "border border-primary glow-shadow bg-base-100"
                : "bg-base-100"
            }`}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  player.isConnected ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span className="font-medium">{player.pseudo}</span>
              {player.isHost && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                  Hôte
                </span>
              )}
            </div>
            {showPlayedStatus && (
              <div>
                {player.hasPlayedCurrentPhase ? (
                  <span className="text-green-600 text-sm">✓ Joué</span>
                ) : (
                  <span className="text-gray-400 text-sm">En attente...</span>
                )}
              </div>
            )}
            {currentPlayer?.isHost && currentPlayerId !== player.id && (
              <Confirm
                variant="destructive"
                size="icon"
                buttonName={
                  <>
                    <X />
                  </>
                }
                message="Vous êtes sûr le point d'exclure ce joueur de la partie."
                onConfirm={() => kickPlayer(player)}
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}