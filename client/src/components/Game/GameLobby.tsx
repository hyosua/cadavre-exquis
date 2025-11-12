"use client";

import React from "react";
import { useGame } from "@/hooks/useGame";
import { Button } from "@/components/ui/button";
import { Confirm } from "../ui/confirm";
import { PlayerList } from "@/components/Game/Playerlist";
import { motion } from "framer-motion";
import CodeCopyBtn from "../ui/copy-btn";

export function GameLobby() {
  const { game, currentPlayer, startGame, cancelGame, leaveGame } = useGame();
  if (!game || !currentPlayer) return null;

  const isHost = currentPlayer.isHost;
  const canStart = game.players.length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(8px)", scale: 0.8 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-card text-card-foreground rounded-2xl p-4 sm:p-8 shadow-lg"
    >
      <div className="text-center mb-4 sm:mb-8">
        <h1 className="text-4xl text-primary font-bold mb-2">
          Salle d&apos;attente
        </h1>
        <div className="inline-block px-6 py-3 rounded-lg">
          <p className="text-sm mb-1">Code de la partie</p>
          <div className="flex items-baseline gap-4">
            <p className="text-3xl font-mono font-bold text-primary">
              {game.code}
            </p>
            <CodeCopyBtn codeToCopy={game.code} />
          </div>
        </div>
      </div>

      <PlayerList players={game.players} currentPlayerId={currentPlayer.id} />

      <div className="mt-4 sm:mt-6 text-muted-foreground rounded-lg p-2 sm:p-4">
        <h4 className="font-semibold mb-2 text-foreground">Configuration</h4>
        <div className="text-md space-y-1 sm:text-lg">
          <p>• Phases: {game.config.phases.join(", ")}</p>
          <p>• Temps par phase: {game.config.timePerPhase}s</p>
        </div>
      </div>

      {isHost && (
        <div className="mt-4 sm:mt-6">
          {!canStart && (
            <p className="text-center mb-2 text-sm cursor-pointer">
              Il faut au moins 2 joueurs pour commencer
            </p>
          )}
          <div className="flex items-center justify-center gap-2">
            <Confirm
              message="Vous êtes sur le point d'annuler la partie"
              buttonName="Annuler"
              className="w-1/2 hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
              onConfirm={cancelGame}
            />
            <Button
              onClick={startGame}
              className="w-1/2"
              disabled={!canStart}
              size="lg"
            >
              Démarrer
            </Button>
          </div>
        </div>
      )}

      {!isHost && (
        <div className="flex flex-col items-center gap-4 sm:gap-8">
          <p className="mt-4 sm:mt-6 text-center text-sm text-accent font-semibold flex items-center gap-2">
            En attente que l&apos;hôte démarre la partie
            <span className="loading loading-dots loading-xs text-accent"></span>
          </p>
          <Confirm
            message="Vous êtes sur le point de quitter la partie."
            buttonName="Quitter"
            className="hover:bg-destructive hover:text-destructive-foreground"
            onConfirm={leaveGame}
          />
        </div>
      )}
    </motion.div>
  );
}
