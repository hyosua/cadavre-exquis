"use client";

import React from "react";
import { useGame } from "@/hooks/useGame";
import { RankingEntry, Sentence } from "@/types/game.type";
import { Button } from "@/components/ui/button";
import { Confirm } from "../ui/confirm";
import { PlayerList } from "@/components/Game/Playerlist";
import CodeCopyBtn from "@/components/ui/copy-btn";
import { motion, Variants } from "framer-motion";
import { Trophy, Medal, Quote, RotateCcw, DoorOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Results() {
  const { game, currentPlayer, startGame, leaveGame } = useGame();

  if (!game || !currentPlayer) return null;

  interface Vote {
    sentenceId: string;
  }

  // Calcul du classement
  const ranking: RankingEntry[] = game?.sentences
    ? game.sentences
        .map((sentence: Sentence) => ({
          sentence,
          voteCount: game.votes.filter(
            (v: Vote) => v.sentenceId === sentence.id
          ).length,
          words: sentence.words,
        }))
        .sort((a: RankingEntry, b: RankingEntry) => b.voteCount - a.voteCount)
    : [];

  const isHost = currentPlayer.isHost;
  const canStart = game.players.length >= 2; // Généralement 2 minimum pour jouer

  // Variants pour l'animation en cascade (Stagger)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {/* En-tête */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">
          Le Verdict
        </h1>
        <p className="text-muted-foreground text-lg">
          Voici les chefs-d&apos;œuvre de cette manche
        </p>
      </div>

      {/* Liste des résultats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {ranking.map((entry, index) => {
          const rank = index + 1;
          const isWinner = rank === 1;

          return (
            <motion.div
              key={entry.sentence.id}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-xl border p-5 transition-all
                ${
                  isWinner
                    ? "bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-800 shadow-lg shadow-amber-500/10"
                    : "bg-card border-border shadow-sm hover:shadow-md"
                }
              `}
            >
              {/* Décoration subtile pour le vainqueur */}
              {isWinner && (
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Trophy size={100} className="text-amber-500 rotate-12" />
                </div>
              )}

              <div className="relative z-10 flex gap-4">
                {/* Colonne Rang */}
                <div className="flex flex-col items-center justify-start pt-1 min-w-[3rem]">
                  {isWinner ? (
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full text-amber-600 dark:text-amber-400 mb-1">
                      <Trophy size={24} />
                    </div>
                  ) : (
                    <div className="font-bold text-2xl text-muted-foreground/50">
                      #{rank}
                    </div>
                  )}
                </div>

                {/* Contenu Phrase */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-2">
                      <Badge
                        variant={isWinner ? "default" : "secondary"}
                        className={
                          isWinner
                            ? "bg-amber-500 hover:bg-amber-600 text-white"
                            : ""
                        }
                      >
                        {entry.voteCount} vote{entry.voteCount > 1 ? "s" : ""}
                      </Badge>
                      {isWinner && (
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400 self-center uppercase tracking-widest">
                          Vainqueur
                        </span>
                      )}
                    </div>

                    <CodeCopyBtn codeToCopy={entry.words.join(" ")} />
                  </div>

                  <blockquote
                    className={`relative text-lg font-medium leading-relaxed ${
                      isWinner
                        ? "text-foreground text-xl"
                        : "text-foreground/80"
                    }`}
                  >
                    <Quote className="absolute -left-4 -top-2 h-3 w-3 text-muted-foreground/30 transform -scale-x-100" />
                    {entry.words.join(" ")}
                    <Quote className="inline-block ml-1 h-3 w-3 text-muted-foreground/30 align-top" />
                  </blockquote>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Actions de fin de manche */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: ranking.length * 0.6 + 0.5 }} // Apparaît après toutes les cartes
        className="space-y-6 pt-6"
      >
        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
          {isHost ? (
            <Button
              onClick={startGame}
              disabled={!canStart}
              size="lg"
              className="w-full sm:w-auto px-8 gap-2 font-semibold shadow-lg shadow-primary/20"
            >
              <RotateCcw size={18} /> Rejouer une manche
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              En attente que l&apos;hôte redémarre la partie...
            </div>
          )}

          <Confirm
            message="Vous êtes sur le point de quitter la partie."
            buttonName={
              <span className="flex items-center gap-2">
                <DoorOpen size={18} /> Quitter
              </span>
            }
            variant="outline"
            className="w-full sm:w-auto"
            onConfirm={leaveGame}
          />
        </div>

        {/* Liste des joueurs discrète en bas */}
        <div className="opacity-80 hover:opacity-100 transition-opacity">
          <PlayerList
            players={game.players}
            currentPlayerId={currentPlayer.id}
          />
        </div>
      </motion.div>
    </div>
  );
}
