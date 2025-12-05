"use client";

import React from "react";
import { useGame } from "@/hooks/useGame";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Confirm } from "../ui/confirm";

export function VotingPhase() {
  const { game, currentPlayer, vote, hasVoted, leaveGame } = useGame();

  if (!game || !currentPlayer) return null;

  const voted = hasVoted();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pop-card p-6 sm:p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl text-primary font-bold mb-3 font-averia rotate-[1deg]">
            Le moment de vérité !
          </h1>
          <p className="font-semibold text-lg text-muted-foreground font-averia rotate-[-1deg]">
            Élisez la phrase la plus innatendue, absurde ou drôle.
          </p>
        </div>

        <div className="space-y-4 rotate-[-1deg]">
          <AnimatePresence>
            {game.sentences.map(
              (sentence: { words: string[]; id: string }, index: number) => {
                const fullSentence = sentence.words.join(" ");
                const voteCount = game.votes.filter(
                  (v: { sentenceId: string }) => v.sentenceId === sentence.id
                ).length;
                const isMyVote = game.votes.find(
                  (v: { sentenceId: string; playerId: string }) =>
                    v.sentenceId === sentence.id &&
                    v.playerId === currentPlayer.id
                );

                return (
                  <motion.div
                    key={sentence.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    // On utilise pop-base ici pour donner un aspect "carte" à chaque phrase
                    // On ajoute une couleur de fond différente si c'est celle qu'on a votée
                    className={`
                      pop-base rounded-lg p-5 transition-all duration-200 relative overflow-hidden
                      ${
                        isMyVote
                          ? "bg-accent/10 border-accent"
                          : "bg-background hover:bg-muted/30"
                      }
                    `}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-foreground text-background text-xs font-bold px-2 py-0.5 rounded-sm font-averia">
                            #{index + 1}
                          </span>
                          {voted && voteCount > 0 && (
                            <span className="pop-tag bg-yellow-300 text-black text-xs font-bold px-2 py-0.5 animate-in zoom-in">
                              {voteCount} vote{voteCount > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        {/* La phrase elle-même en averia pour le style littéraire */}
                        <p className="text-xl sm:text-2xl font-medium text-foreground font-averia leading-tight">
                          « {fullSentence} »
                        </p>
                      </div>

                      <div className="w-full sm:w-auto flex-shrink-0">
                        {!voted ? (
                          <Button
                            onClick={() => vote(sentence.id)}
                            disabled={voted}
                            className="pop-btn w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-averia text-lg "
                          >
                            Voter
                          </Button>
                        ) : isMyVote ? (
                          <div className="flex items-center justify-center sm:justify-end gap-2 text-primary font-bold font-averia text-lg">
                            <span>A voté</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                );
              }
            )}
          </AnimatePresence>
        </div>

        {voted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-muted/20 border-2 border-dashed border-muted-foreground/30 rounded-xl text-center"
          >
            <p className="text-muted-foreground font-averia text-lg">
              Les autres écrivains débattent encore... Patience.
            </p>
          </motion.div>
        )}
      </motion.div>

      <div className="flex justify-center pb-8">
        <Confirm
          message="Vous ne saurez jamais qui a gagné..."
          variant="destructive"
          buttonName="Abandonner la partie"
          className="pop-btn bg-destructive text-destructive-foreground hover:bg-destructive/90 w-auto px-6"
          onConfirm={leaveGame}
        />
      </div>
    </div>
  );
}
