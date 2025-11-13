"use client";

import React, { useState, useEffect } from "react";
import { useGame } from "@/hooks/useGame";
import { RankingEntry, Sentence } from "@/types/game.type";
import { Button } from "@/components/ui/button";
import { Confirm } from "../ui/confirm";
import { PlayerList } from "@/components/Game/Playerlist";
import CodeCopyBtn from "@/components/ui/copy-btn";

export function Results() {
  const { game, currentPlayer, startGame, leaveGame } = useGame();
  const [revealedCount, setRevealedCount] = useState(0);
  const [isRevealing, setIsRevealing] = useState(true);

  interface Vote {
    sentenceId: string;
  }

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

  useEffect(() => {
    if (revealedCount < ranking.length) {
      const timer = setTimeout(() => {
        setRevealedCount((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsRevealing(false);
    }
  }, [revealedCount, ranking.length]);

  if (!game || !currentPlayer) return null;
  const isHost = currentPlayer.isHost;
  const canStart = game.players.length >= 1;

  const getRank = (index: number) => {
    return index + 1;
  };

  return (
    <>
      <div className="bg-card shadow-xl text-card-foreground rounded-2xl p-8 animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Résultats</h1>
          <p className="font-semibold text-foreground">
            Classement des meilleures phrases
          </p>
        </div>

        <div className="space-y-4 relative">
          {ranking.map((entry, index) => {
            const isRevealed = ranking.length - 1 - index < revealedCount;
            const isWinner = index === 0;
            const rank = getRank(index);

            if (!isRevealed) return null;

            return (
              <div
                key={entry.sentence.id}
                className={`rounded-xl p-6 transition-all duration-700 transform ${
                  isWinner && !isRevealing
                    ? "scale-105 shadow-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-900/40 dark:via-yellow-900/40 dark:to-amber-900/40 border-2 border-amber-300 dark:border-amber-600"
                    : isWinner
                    ? "bg-gradient-to-br  shadow-2xl from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-900/40 dark:via-yellow-900/40 dark:to-amber-900/40 border-2 border-amber-300 dark:border-amber-600"
                    : "bg-white shadow-2xl dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                } ${
                  isRevealed
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  animation: isRevealed ? "slideIn 0.6s ease-out" : "none",
                  position: "relative",
                }}
              >
                {/* Effet spotlight pour le gagnant */}
                {isWinner && !isRevealing && (
                  <>
                    <div className="absolute inset-0 bg-gradient-radial from-amber-300/30 via-transparent to-transparent rounded-xl animate-pulse pointer-events-none" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/40 to-yellow-400/40 rounded-xl blur-sm opacity-50 animate-pulse pointer-events-none" />
                  </>
                )}

                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-lg font-bold ${
                          isWinner ? "text-amber-300" : "text-slate-300"
                        }`}
                      >
                        #{rank}
                      </span>
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          isWinner
                            ? "bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {entry.voteCount} vote{entry.voteCount > 1 ? "s" : ""}
                      </span>
                      <span className="self-end">
                        <CodeCopyBtn codeToCopy={entry.words.join(" ")} />
                      </span>
                    </div>
                    <p
                      className={`text-lg ${
                        isWinner
                          ? "text-amber-900 dark:text-amber-50 font-semibold text-xl"
                          : "text-slate-700 dark:text-slate-200 font-semibold"
                      }`}
                    >
                      {entry.words.join(" ")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isRevealing && (
        <div className="flex justify-center mt-4 mb-4 gap-2 animate-in fade-in duration-500">
          {isHost && (
            <>
              <Button
                onClick={startGame}
                disabled={!canStart}
                className="w-full max-w-28"
                size="lg"
              >
                Rejouer
              </Button>
            </>
          )}

          {!isHost && (
            <p className="mt-6 text-center text-lg text-accent-foreground">
              En attente que l&apos;hôte redémarre la partie...
            </p>
          )}
        </div>
      )}

      {!isRevealing && (
        <div className="animate-in fade-in duration-500">
          <PlayerList
            players={game.players}
            currentPlayerId={currentPlayer.id}
          />
          <div className="py-4 text-center">
            <Confirm
              message="Vous êtes sur le point de quitter la partie."
              buttonName="Quitter"
              variant={"destructive"}
              className="hover:bg-destructive hover:text-destructive-foreground"
              onConfirm={leaveGame}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
