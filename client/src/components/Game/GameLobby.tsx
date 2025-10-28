'use client';

import React from 'react';
import { useGame } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';
import { Confirm } from '../ui/confirm';
import { PlayerList } from '@/components/Game/Playerlist';
import { motion } from 'framer-motion';
import CodeCopyBtn from '../ui/copy-btn';


export function GameLobby() {
  const { game, currentPlayer, startGame, cancelGame } = useGame();
  if (!game || !currentPlayer) return null;

  const isHost = currentPlayer.isHost;
  const canStart = game.players.length >= 2;

  return (
    <div className="bg-base-300 border border-gray-500 min-h-screen  p-4">
      <div className="max-w-2xl mx-auto mt-8">
        <motion.div 
          initial={{opacity: 0, filter: 'blur(8px)', scale: 0.8 }}
          animate={{opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{duration: 0.2, ease:'easeOut'}}
          className="bg-base-100 rounded-2xl p-8 animate-pulse-shadow"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl text-primary font-bold mb-2">Salle d&apos;attente</h1>
            <div className="inline-block bg-primary-100 px-6 py-3 rounded-lg">
              <p className="text-sm  mb-1">Code de la partie</p>
              <div className='flex items-baseline gap-4'>
                <p className="text-3xl font-mono font-bold  text-secondary">{game.code}</p>
                <CodeCopyBtn codeToCopy={game.code} />
              </div>
            </div>
          </div>

          <PlayerList 
            players={game.players} 
            currentPlayerId={currentPlayer.id}
          />

          <div className="mt-6 bg-base-100 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Configuration</h4>
            <div className="text-md  space-y-1 sm:text-lg">
              <p>• Phases: {game.config.phases.join(', ')}</p>
              <p>• Temps par phase: {game.config.timePerPhase}s</p>
            </div>
          </div>

          {isHost && (
            <div className="mt-6">
              {!canStart && (
                <p className="text-center text-amber-600 mb-2 text-sm">
                  Il faut au moins 2 joueurs pour commencer
                </p>
              )}
              <div className='flex items-center gap-2'>
                <Confirm
                  message="Vous êtes sur le point d'annuler la partie"
                  buttonName='Annuler'
                  className='hover:bg-error '
                  onConfirm={cancelGame}
                />
                <Button
                  onClick={startGame}
                  className="w-full"
                  disabled={!canStart}
                  size="lg"
                >
                  Démarrer
                </Button>
              </div>
            </div>
          )}

          {!isHost && (
            <p className="mt-6 text-center text-sm text-info font-semibold">
              <span className="loading loading-dots loading-xs"></span>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}