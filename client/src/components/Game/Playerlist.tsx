import React from "react";
import { Player } from "@/types/game.type";
import { motion } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import { X } from "lucide-react";
import { Confirm } from "../ui/confirm";
import { Badge } from "@/components/ui/badge";

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
  showPlayedStatus?: boolean;
}

export function PlayerList({
  players,
  currentPlayerId,
  showPlayedStatus = false,
}: PlayerListProps) {
  const { kickPlayer, currentPlayer } = useGame();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-secondary/50 border border-border rounded-lg shadow-[0_8px_34px_-6px_hsl(var(--primary)/0.15)] p-4"
    >
      <h3 className="text-lg font-semibold mb-3">Joueurs ({players.length})</h3>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-2 rounded transition-colors ${
              player.id === currentPlayerId
                ? "border border-primary  bg-card"
                : "bg-card"
            }`}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  player.isConnected ? "bg-green-500" : "bg-muted-foreground/40"
                }`}
              />
              <span className="font-medium">{player.pseudo}</span>
              {player.isHost && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                >
                  Hôte
                </Badge>
              )}
            </div>
            {showPlayedStatus && (
              <div>
                {player.hasPlayedCurrentPhase ? (
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                    ✓ Joué
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    En attente...
                  </span>
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
