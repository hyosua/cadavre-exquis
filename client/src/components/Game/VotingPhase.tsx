'use client';

import React from 'react';
import { useGame } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';

export function VotingPhase() {
  const { game, currentPlayer, vote, hasVoted } = useGame();

  if (!game || !currentPlayer) return null;

  const voted = hasVoted();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-neutral rounded-2xl shadow-xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold  mb-2">Vote</h1>
            <p className="font-semibold">Choisissez votre phrase préférée !</p>
          </div>

          <div className="space-y-4">
            {game.sentences.map((sentence: { words: string[]; id: string; }, index: number) => {
              const fullSentence = sentence.words.join(' ');
              const voteCount = game.votes.filter((v: { sentenceId: string; }) => v.sentenceId === sentence.id).length;

              return (
                <div
                  key={sentence.id}
                  className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center sm:items-start justify-center sm:justify-between sm:flex-row">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Phrase {index + 1}</p>
                      <p className="text-lg font-medium text-gray-900 mb-2">{fullSentence}</p>
                      {voted && (
                        <p className="text-sm text-gray-600">
                          {voteCount} vote{voteCount > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => vote(sentence.id)}
                      disabled={voted}
                      className="ml-4"
                    >
                      {voted ? 'Voté' : 'Voter'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {voted && (
            <p className="text-center text-gray-500 mt-6">
              Vote enregistré ! En attente des autres joueurs...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}