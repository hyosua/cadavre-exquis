"use client";

import React from "react";
import { Player } from "@/types/game.type";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import { X, Crown, Hourglass, Check } from "lucide-react";
import { Confirm } from "../ui/confirm";
import { WritingLoader } from "./WritingLoader";

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      // On utilise pop-card pour le conteneur global
      className="pop-card p-5 bg-card"
    >
      {/* En-tête Fun */}
      <div className="flex items-center justify-between mb-6 border-b-2 border-foreground/10 pb-4">
        <h3 className="text-xl font-averia font-bold -rotate-1">
          La Troupe ({players.length})
        </h3>
        <div className="flex gap-1">
          {/* Petits ronds décoratifs style mac OS rétro */}
          <div className="w-3 h-3 rounded-full border-2 border-foreground bg-primary"></div>
          <div className="w-3 h-3 rounded-full border-2 border-foreground bg-secondary"></div>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {players.map((player) => {
            const isMe = player.id === currentPlayerId;
            const isHost = player.isHost;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={player.id}
                // Chaque joueur est une "pop-base" (petite carte)
                // Le joueur actif a un fond jaune (ou accent) pour ressortir
                className={`
                  pop-base rounded-lg p-3 flex items-center justify-between transition-all
                  ${
                    isMe
                      ? "bg-accent border-yellow-900 "
                      : "bg-background hover:translate-x-1"
                  }
                `}
              >
                {/* --- Partie Gauche : Identité --- */}
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* Avatar / Indicateur en ligne stylisé */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full border-2 border-foreground flex items-center justify-center font-bold text-xs ${
                        isMe
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {player.pseudo.charAt(0).toUpperCase()}
                    </div>
                    {/* Pastille de connexion */}
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-foreground rounded-full ${
                        player.isConnected ? "bg-green-400" : "bg-gray-400"
                      }`}
                      title={player.isConnected ? "En ligne" : "Hors ligne"}
                    />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-averia font-bold truncate ${
                          isMe ? "text-foreground dark:text-muted" : ""
                        }`}
                      >
                        {player.pseudo} {isMe && "(Moi)"}
                      </span>
                    </div>

                    {/* Badge Hôte Cartoon */}
                    {isHost && (
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-600 bg-amber-100 w-fit px-1.5 rounded-sm border border-amber-600/30">
                        <Crown size={10} strokeWidth={3} /> Chef
                      </div>
                    )}
                  </div>
                </div>

                {/* --- Partie Droite : Statut & Actions --- */}
                <div className="flex items-center gap-3 pl-2">
                  {showPlayedStatus && (
                    <div className="flex justify-end min-w-[30px]">
                      {player.hasPlayedCurrentPhase ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="bg-green-500 text-white p-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <Check size={16} strokeWidth={4} />
                        </motion.div>
                      ) : player.isThinking ? (
                        <div className="text-foreground font-bold origin-right">
                          <WritingLoader />
                        </div>
                      ) : (
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-foreground opacity-50"
                        >
                          <Hourglass size={20} />
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Bouton Kick */}
                  {currentPlayer?.isHost && currentPlayerId !== player.id && (
                    <Confirm
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-md bg-destructive/20 hover:bg-destructive hover:text-white border-2 border-transparent hover:border-black transition-all"
                      buttonName={<X size={16} strokeWidth={3} />}
                      message={`Expulser ${player.pseudo} ? C'est un peu rude, non ?`}
                      onConfirm={() => kickPlayer(player)}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
