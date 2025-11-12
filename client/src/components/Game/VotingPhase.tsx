"use client";

import React from "react";
import { useGame } from "@/hooks/useGame";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Confirm } from "../ui/confirm";

export function VotingPhase() {
  const { game, currentPlayer, vote, hasVoted, leaveGame } = useGame();

  if (!game || !currentPlayer) return null;

  const voted = hasVoted();

  return (
    <>
      <div className=" bg-card text-card-foreground rounded-2xl p-8 animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-primary font-bold mb-2">Vote</h1>
          <p className="font-semibold text-foreground">
            Choisissez votre phrase préférée !
          </p>
        </div>

        <div className="space-y-4">
          {game.sentences.map(
            (sentence: { words: string[]; id: string }, index: number) => {
              const fullSentence = sentence.words.join(" ");
              const voteCount = game.votes.filter(
                (v: { sentenceId: string }) => v.sentenceId === sentence.id
              ).length;

              return (
                <motion.div
                  initial={{ opacity: 0, filter: "blur(8px)", scale: 0.8 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  key={sentence.id}
                  className=" border border-border rounded-lg p-4 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex flex-col items-center sm:items-center justify-center sm:justify-between sm:flex-row gap-4">
                    <div className="flex-1 w-full">
                      <p className="text-sm text-primary font-bold mb-1">
                        Phrase {index + 1}
                      </p>
                      <p className="text-lg font-medium text-foreground mb-2">
                        {fullSentence}
                      </p>
                      {voted && (
                        <p className="text-sm text-accent font-semibold">
                          {voteCount} vote{voteCount > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    {!voted && (
                      <Button
                        onClick={() => vote(sentence.id)}
                        disabled={voted}
                        className="w-full sm:w-auto sm:ml-4"
                        size="default"
                      >
                        {voted ? "Voté" : "Voter"}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            }
          )}
        </div>

        {voted && (
          <p className="text-center mt-6 text-accent font-semibold">
            Vote enregistré ! En attente des autres joueurs...
          </p>
        )}
      </div>
      <div className="mt-4 text-center">
        <Confirm
          message="Vous êtes sur le point de quitter la partie."
          variant={"destructive"}
          buttonName="Quitter"
          className="hover:bg-destructive hover:text-destructive-foreground"
          onConfirm={leaveGame}
        />
      </div>
    </>
  );
}
