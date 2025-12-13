"use client";

import React from "react";
import { useGame } from "@/hooks/useGame";
import { RankingEntry, Sentence } from "@/types/game.type";
import { Button } from "@/components/ui/button";
import { Confirm } from "../ui/confirm";
import { PlayerList } from "@/components/Game/Playerlist";
import CodeCopyBtn from "@/components/ui/copy-btn";
import { motion, Variants } from "framer-motion";
import { RotateCcw, Quote } from "lucide-react";

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
        staggerChildren: 0.4, // Un peu plus rapide pour le rythme
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, rotate: -2 },
    show: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { type: "spring", stiffness: 120, damping: 12 },
    },
  };

  // Couleurs dynamiques pour le podium
  const getRankStyles = (rank: number) => {
    if (rank === 1)
      return "bg-yellow-100 border-yellow-500 shadow-[4px_4px_0px_0px_var(--yellow-500)]"; // Or
    if (rank === 2)
      return "bg-slate-100 border-slate-500 shadow-[4px_4px_0px_0px_var(--slate-500)]"; // Argent
    if (rank === 3)
      return "bg-orange-100 border-orange-500 shadow-[4px_4px_0px_0px_var(--orange-500)]"; // Bronze
    return "bg-muted border-foreground shadow-[4px_4px_0px_0px_oklch(var(--foreground))]"; // Le reste
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12 px-4">
      {/* En-tête Fun */}
      <div className="text-center space-y-2 pt-8 pb-6">
        <h1 className="text-4xl sm:text-6xl font-averia font-bold text-primary drop-shadow-sm -rotate-2">
          Résultats
        </h1>
        <p className="text-muted-foreground font-averia text-lg">
          Voici les chefs-d&apos;œuvre (ou pas).
        </p>
      </div>

      {/* Liste des résultats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {ranking.map((entry, index) => {
          const rank = getRealRank(index);
          const isTop = rank === 1;

          return (
            <motion.div
              key={entry.sentence.id}
              variants={itemVariants}
              className="relative group"
            >
              {/* Badge de rang qui dépasse */}
              <div className="absolute -top-4 -left-2 z-20 flex">
                <div
                  className={`
                  flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 font-bold font-averia text-xl
                  ${
                    rank === 1
                      ? "bg-yellow-400 border-black text-black"
                      : rank === 2
                      ? "bg-slate-300 border-black text-black"
                      : rank === 3
                      ? "bg-orange-300 border-black text-black"
                      : "bg-white border-black text-black"
                  }
                `}
                >
                  #{rank}
                </div>
              </div>

              {/* Carte principale */}
              <div
                className={`relative rounded-xl border-2 p-4 sm:p-8 transition-transform hover:-translate-y-1 duration-200
                  ${getRankStyles(rank)}
                `}
              >
                <div className="flex flex-col gap-2">
                  {/* Phrase */}
                  <div className="text-center px-2">
                    <Quote
                      size={16}
                      className="inline-block text-black rotate-180 align-top mr-2"
                      fill="black"
                    />
                    <span
                      className={`font-averia text-xl sm:text-3xl text-black leading-snug ${
                        isTop ? "font-bold" : ""
                      }`}
                    >
                      {entry.words.join(" ")}
                    </span>
                    <Quote
                      size={14}
                      className="inline-block text-black align-bottom ml-2"
                      fill="black"
                    />
                  </div>

                  {/* Footer de la carte: Votes & Copie */}
                  <div className="flex items-center justify-between  pt-2 border-t-2 border-dashed border-foreground/10">
                    <div className="flex items-center gap-2">
                      <div className="bg-foreground text-background px-3 py-1 rounded-full font-bold font-averia text-sm">
                        {entry.voteCount} vote{entry.voteCount > 1 ? "s" : ""}
                      </div>
                      {isTop && (
                        <span className="text-sm font-bold text-yellow-600 hidden sm:inline">
                          Lauréat
                        </span>
                      )}
                    </div>

                    <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                      <CodeCopyBtn codeToCopy={entry.words.join(" ")} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Actions de fin de manche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ranking.length * 0.4 + 0.2 }}
        className="pt-8 space-y-6 border-t-2 border-foreground/10 mt-8"
      >
        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
          {isHost ? (
            <Button
              onClick={startGame}
              disabled={!canStart}
              // Style "pop-btn" inline
              className="h-14 px-8 text-lg font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_oklch(var(--foreground))] bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_oklch(var(--foreground))] transition-all active:translate-y-0 active:shadow-none"
            >
              <RotateCcw className="h-5 w-5" /> Rejouer !
            </Button>
          ) : (
            <div className="bg-muted border-2 border-foreground border-dashed rounded-lg p-4 flex items-center gap-3">
              <div className="h-3 w-3 bg-primary rounded-full animate-pulse" />
              <span className="font-averia text-muted-foreground">
                On attend le chef...
              </span>
            </div>
          )}

          <Confirm
            message="Partir maintenant ? C'est triste."
            buttonName="Quitter"
            // Style "pop-btn" variante destructive inline
            className="h-14 px-6 text-lg font-bold border-2 border-foreground shadow-[4px_4px_0px_0px_oklch(var(--foreground))] bg-destructive/40 hover:bg-destructive hover:text-white transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_oklch(var(--foreground))] active:translate-y-0 active:shadow-none"
            onConfirm={leaveGame}
          />
        </div>

        <div className="opacity-90">
          <PlayerList
            players={game.players}
            currentPlayerId={currentPlayer.id}
          />
        </div>
      </motion.div>
    </div>
  );
}
