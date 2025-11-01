'use client';

import React from 'react';
import { useGame } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Confirm } from '../ui/confirm';

export function VotingPhase() {
  const { game, currentPlayer, vote, hasVoted, leaveGame } = useGame();

  if (!game || !currentPlayer) return null;

  const voted = hasVoted();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto mt-8">
        <div className="shadow-[0_8px_24px_-6px_rgba(34,211,238,0.15)] sm:red-glow-shadow bg-base-300 rounded-2xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl text-primary font-bold  mb-2">Vote</h1>
            <p className="font-semibold">Choisissez votre phrase préférée !</p>
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
                    className="bg-neutral  rounded-lg p-2 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex flex-col items-center sm:items-center justify-center sm:justify-between sm:flex-row">
                      <div className="flex-1">
                        <p className="text-sm text-primary font-bold  mb-1">
                          Phrase {index + 1}
                        </p>
                        <p className="text-lg font-medium  mb-2">
                          {fullSentence}
                        </p>
                        {voted && (
                          <p className="text-sm text-secondary  font-semibold">
                            {voteCount} vote{voteCount > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                      {!voted && (
                        <Button
                          onClick={() => vote(sentence.id)}
                          disabled={voted}
                          className="ml-4"
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
            <p className="text-center mt-6">
              Vote enregistré ! En attente des autres joueurs...
            </p>
          )}
        </div>
        <div className="mt-4 text-center">
          <Confirm
            message="Vous êtes sur le point de quitter la partie."
            buttonName="Quitter"
            className="hover:bg-error "
            onConfirm={leaveGame}
          />
        </div>
      </div>
    </div>
  );
}