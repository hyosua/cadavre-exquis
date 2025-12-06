"use client";

import React from "react";
import { useGame } from "@/hooks/useGame";
import { Button } from "@/components/ui/button";
import { Confirm } from "../ui/confirm";
import { PlayerList } from "@/components/Game/Playerlist";
import { motion } from "framer-motion";
import CodeCopyBtn from "../ui/copy-btn";
import { Ticket, Play, Ban, ListOrdered, Timer } from "lucide-react";

export function GameLobby() {
  const { game, currentPlayer, startGame, cancelGame, leaveGame } = useGame();

  if (!game || !currentPlayer) return null;

  const isHost = currentPlayer.isHost;
  const canStart = game.players.length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
      // APPLICATION DU STYLE POP-CARD
      className="pop-card max-w-2xl mx-auto p-6 sm:p-10"
    >
      {/* En-tête avec Titre */}
      <div className="text-center mb-4 lg:mb-8 space-y-2">
        <h1 className="text-4xl sm:text-5xl font-averia font-bold text-primary -rotate-2 drop-shadow-sm">
          Salle d&apos;Attente
        </h1>
        <p className="text-muted-foreground font-averia text-lg">
          Rassemblez votre équipe de poètes.
        </p>
      </div>

      {/* Zone du CODE - Style "Ticket" */}
      <div className="mb-8 relative group">
        <div className="absolute inset-0 bg-primary/80 translate-x-2 translate-y-2 rounded-xl -rotate-1" />
        <div className="relative bg-card border-2 border-dashed border-primary/50 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary transition-colors">
          <div className="flex items-center gap-2 text-primary font-bold font-averia uppercase tracking-widest text-sm lg:text-lg">
            <Ticket size={20} />
            Ticket d&apos;entrée
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <p className="text-5xl sm:text-6xl font-mono font-bold text-foreground tracking-wider">
              {game.code}
            </p>
            <div className="scale-110">
              <CodeCopyBtn codeToCopy={game.code} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-averia">
            Partagez ce code avec vos victimes.
          </p>
        </div>
      </div>

      {/* Liste des joueurs (Déjà stylisée, on l'intègre simplement) */}
      <div className="mb-8">
        <PlayerList players={game.players} currentPlayerId={currentPlayer.id} />
      </div>

      {/* CONFIGURATION : Style "Post-it" ou "Note technique" */}
      <div className="mb-4 lg:mb-8 pop-base bg-background p-4 rounded-lg flex flex-col sm:flex-row items-center justify-around gap-4 text-sm sm:text-base">
        <h4 className="font-bold font-averia text-lg border-b-2 border-primary/30 sm:border-none px-2">
          Paramètres :
        </h4>

        <div
          className="flex items-center gap-2 font-averia"
          title="Ordre des phases"
        >
          <ListOrdered className="text-primary" size={20} />
          <span className="font-semibold text-foreground/80">
            {game.config.phases.length} phases
          </span>
          {/* Tooltip textuel simple pour les phases si besoin */}
          <span className="text-xs text-foreground sm:inline">
            ({game.config.phases.join(", ")})
          </span>
        </div>

        <div className="h-8 w-px bg-border hidden sm:block" />

        <div
          className="flex items-center gap-2 font-averia"
          title="Temps par tour"
        >
          <Timer className="text-primary" size={20} />
          <span className="font-semibold text-foreground/80">
            {game.config.timePerPhase} sec / tour
          </span>
        </div>
      </div>

      {/* Actions Hôte */}
      {isHost && (
        <div className="space-y-4 pt-4 border-t-2 border-dashed border-foreground/10">
          {!canStart && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-accent font-bold font-averia flex items-center justify-center gap-2"
            >
              Il faut au moins 2 joueurs !
            </motion.p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Confirm
              message="Voulez-vous vraiment annuler la partie ?"
              variant={"destructive"}
              buttonName={
                <span className="flex items-center gap-2">
                  <Ban size={18} /> Annuler tout
                </span>
              }
              // Style bouton destructif pop
              className="pop-btn bg-white hover:bg-destructive hover:text-white border-destructive/20 text-destructive w-full sm:w-auto"
              onConfirm={cancelGame}
            />

            <Button
              onClick={startGame}
              disabled={!canStart}
              // Style bouton primaire pop (Gros bouton vert/primaire)
              className="pop-btn w-full sm:w-auto h-12 px-8 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none disabled:translate-y-[2px] disabled:translate-x-[2px]"
            >
              <Play className="mr-2 fill-current" /> Lancer la partie !
            </Button>
          </div>
        </div>
      )}

      {/* Actions Invité */}
      {!isHost && (
        <div className="flex flex-col items-center gap-6 pt-4 border-t-2 border-dashed border-foreground/30">
          <div className="bg-muted border-2 border-muted-foreground border-dashed rounded-lg p-4 flex items-center gap-3 w-full justify-center">
            <p className="text-muted-foreground font-bold font-averia">
              Le chef prépare le terrain...
            </p>
          </div>

          <Confirm
            message="Partir déjà ? Vous n'avez même pas commencé !"
            buttonName="Quitter le lobby"
            variant={"destructive"}
            // Style bouton ghost/pop
            className="w-auto px-6"
            onConfirm={leaveGame}
          />
        </div>
      )}
    </motion.div>
  );
}
