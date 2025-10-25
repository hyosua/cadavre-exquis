'use client';

import React from 'react';
import { useGame } from '@/hooks/useGame';
import { RankingEntry, Sentence } from '@/types/game.type';
import { Button } from '@/components/ui/button';
import { Confirm } from '../ui/confirm';
import { PlayerList } from '@/components/Game/Playerlist';


export function Results() {
  const { game, currentPlayer, startGame, leaveGame, cancelGame} = useGame();

  if (!game || !currentPlayer) return null;
  const isHost = currentPlayer.isHost;
  // à modifier pour implémenter un bouton ready
  const canStart = game.players.length >= 1;

interface Vote {
    sentenceId: string;
}

const ranking: RankingEntry[] = game.sentences
    .map((sentence: Sentence) => ({
        sentence,
        voteCount: game.votes.filter((v: Vote) => v.sentenceId === sentence.id).length,
        words: sentence.words,
    }))
    .sort((a: RankingEntry, b: RankingEntry) => b.voteCount - a.voteCount);
    
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-neutral rounded-2xl shadow-xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold  mb-2">🏆 Résultats</h1>
            <p className="font-semibold">Classement des meilleures phrases</p>
          </div>

          <div className="space-y-4">
            {ranking.map((entry, index) => {
              const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
              
              return (
                <div
                  key={entry.sentence.id}
                  className={`rounded-lg p-6 ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{medal}</span>
                        <span className="text-sm font-semibold text-gray-600">
                          {entry.voteCount} vote{entry.voteCount > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-lg font-medium text-gray-900">
                        {entry.words.join(' ')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className='flex justify-center mt-4 mb-4 gap-2'>
          
          {isHost && (
            <>
              <Confirm
                message="Vous êtes sur le point de supprimer la partie."
                buttonName='Quitter'
                className='hover:bg-error '
                onConfirm={cancelGame}
              />
              <Button
                onClick={startGame}
                disabled={!canStart}
                className="w-full max-w-lg"
                size="lg"
              >
                Rejouer
              </Button>
            </>
          )}

          {!isHost && (
            <p className="mt-6 text-center text-sm text-info font-semibold">
              En attente que l&apos;hôte redémarre la partie...
            </p>
            
          )}
        </div>  
        <PlayerList 
                    players={game.players} 
                    currentPlayerId={currentPlayer.id}
        />

        {!isHost && (
          <div className='py-4 text-center'>
            <Confirm
              message="Vous êtes sur le point de quitter la partie."
              buttonName='Quitter'
              className='hover:bg-error '
              onConfirm={leaveGame}
            />
          </div>
        )}
      </div>
    </div>
  );
}