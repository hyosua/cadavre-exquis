"use client";

import React from "react";
import { useGame } from "@/hooks/useGame";
import { RankingEntry, Sentence } from "@/types/game.type";
import { Button } from "@/components/ui/button";
import { Confirm } from "../ui/confirm";
import { PlayerList } from "@/components/Game/Playerlist";
import CodeCopyBtn from "@/components/ui/copy-btn";
import { motion, Variants } from "framer-motion";
import { RotateCcw, DoorOpen, Quote } from "lucide-react";

export function Results() {
  const { game, currentPlayer, startGame, leaveGame } = useGame();

  if (!game || !currentPlayer) return null;

  interface Vote {
    sentenceId: string;
  }

  // Calcul du classement avec gestion des ex-aequo
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

  // Calculer le rang réel en tenant compte des ex-aequo
  const getRealRank = (index: number): number => {
    if (index === 0) return 1;
    const currentVotes = ranking[index].voteCount;
    const previousVotes = ranking[index - 1].voteCount;
    if (currentVotes === previousVotes) {
      return getRealRank(index - 1);
    }
    return index + 1;
  };

  const isHost = currentPlayer.isHost;
  const canStart = game.players.length >= 2;

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
      <div className="text-center space-y-4 pt-8 pb-4">
        <h1 className="text-4xl font-serif font-light tracking-wide text-foreground">
          Les Chef-d&apos;oeuvres
        </h1>
        <div className="flex justify-center">
          <div className="flex items-center gap-3 text-muted-foreground/40">
            <div className="h-px w-16 bg-current" />
            <div className="w-2 h-2 rounded-full bg-current" />
            <div className="h-px w-16 bg-current" />
          </div>
        </div>
        <p className="text-muted-foreground text-sm tracking-wider uppercase">
          Sélection du jury
        </p>
      </div>

      {/* Liste des résultats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {ranking.map((entry, index) => {
          const rank = getRealRank(index);
          const isTop = rank === 1;

          return (
            <motion.div
              key={entry.sentence.id}
              variants={itemVariants}
              className="group relative"
            >
              <div
                className={`relative overflow-hidden rounded-2xl border transition-all
                ${
                  isTop
                    ? "bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-slate-300 dark:border-slate-700 shadow-xl"
                    : "bg-card/50 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md"
                }
              `}
              >
                {/* Ligne décorative supérieure subtile */}
                <div
                  className={`h-1 w-full ${
                    isTop
                      ? "bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400"
                      : "bg-gradient-to-r from-transparent via-border to-transparent"
                  }`}
                />

                <div className="p-8 space-y-6">
                  {/* En-tête avec rang et votes */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`text-sm font-serif italic ${
                          isTop
                            ? "text-slate-600 dark:text-slate-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {rank === 1 && "Lauréat"}
                        {rank === 2 && "Finaliste"}
                        {rank === 3 && "Mention"}
                        {rank > 3 && `Sélection ${rank}`}
                      </div>
                      <div className="h-1 w-8 bg-border/50" />
                      <span
                        className={`text-xs tracking-wider uppercase ${
                          isTop
                            ? "text-slate-600 dark:text-slate-400 font-medium"
                            : "text-muted-foreground/70"
                        }`}
                      >
                        {entry.voteCount} voix
                      </span>
                    </div>

                    <CodeCopyBtn codeToCopy={entry.words.join(" ")} />
                  </div>

                  {/* Citation principale */}
                  <div className="flex justify-center">
                    <div className="text-6xl font-serif text-border/20 leading-none">
                      <Quote
                        size={14}
                        fill="color-mix(in oklab, var(--color-border) 20%, transparent)"
                      />
                    </div>
                    <p
                      className={`font-serif leading-relaxed pl-4 pr-4 ${
                        isTop
                          ? "text-2xl text-foreground"
                          : "text-xl text-foreground/90"
                      }`}
                    >
                      {entry.words.join(" ")}
                    </p>
                    <div className="text-6xl font-serif text-border/20 leading-none">
                      <Quote
                        size={14}
                        fill="color-mix(in oklab, var(--color-border) 20%, transparent)"
                      />
                    </div>
                  </div>

                  {/* Séparateur décoratif pour le lauréat */}
                  {isTop && (
                    <div className="flex justify-center pt-2">
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-600">
                        <div className="h-px w-12 bg-current" />
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        <div className="h-px w-12 bg-current" />
                      </div>
                    </div>
                  )}
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
        transition={{ delay: ranking.length * 0.6 + 0.5 }}
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
