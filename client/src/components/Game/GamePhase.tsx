'use client';

import React, { useState } from 'react';
import { useGame } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer } from '@/components/ui/Timer';
import { PlayerList } from '@/components/Game/Playerlist';

export function GamePhase() {
  const { game, currentPlayer, timeLeft, submitWord, hasPlayedCurrentPhase, getCurrentSentence } = useGame();
  const [word, setWord] = useState('');

  if (!game || !currentPlayer) return null;

  const currentPhaseLabel = game.config.phases[game.currentPhase];
  const hasPlayed = hasPlayedCurrentPhase();
  const currentSentence = getCurrentSentence();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim()) {
      submitWord(word.trim());
      setWord('');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-base-100 flex items-center justify-center flex-col rounded-2xl shadow-xl p-8 animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Phase {game.currentPhase + 1} / {game.config.phases.length}
            </h1>
            <p className="text-xl text-primary font-semibold">{currentPhaseLabel}</p>
          </div>

          <Timer timeLeft={timeLeft} totalTime={game.config.timePerPhase} />

          <div className="mt-8 grid gap-6 w-full">
            <div>
              {currentSentence && currentSentence.words.length > 0 && (
                <div className="bg-neutral border border-neutral rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-semibold  mb-2">Phrase en cours</h3>
                  <p className="text-lg font-medium">
                    {currentSentence.words.join(' ')}...
                  </p>
                </div>
              )}

              {!hasPlayed ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder={`Entrez ${currentPhaseLabel.toLowerCase()}...`}
                    maxLength={50}
                    autoFocus
                  />
                  <Button type="submit" className="w-full" size="lg" disabled={!word.trim()}>
                    Valider
                  </Button>
                </form>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-green-600 text-4xl mb-2">✓</div>
                  <p className="text-green-800 font-semibold">Mot envoyé !</p>
                  <p className="text-green-600 text-sm mt-1">
                    En attente des autres joueurs...
                  </p>
                </div>
              )}
            </div>

            <div>
              <PlayerList
                players={game.players}
                currentPlayerId={currentPlayer.id}
                showPlayedStatus={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}