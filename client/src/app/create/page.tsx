'use client';

import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/hooks/useGame';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSocket } from '@/hooks/useSocket';
import { motion } from 'framer-motion';
import Loader from '@/components/ui/loader';


const DEFAULT_PHASES = [
  'Nom commun',
  'Adjectif',
  'Verbe transitif',
  'Nom commun',
  'Circonstances'
];

export default function CreateGame() {
  useSocket();

  const router = useRouter();
  const { createGame } = useGame();
  const { setOnGameCreated } = useGameStore();
  const [pseudo, setPseudo] = useState('');
  const [timePerPhase, setTimePerPhase] = useState(60);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setOnGameCreated((gameId: string) => {
      console.log("🚀 Navigation vers /game/" + gameId);
      router.push(`/game/${gameId}`);
    });

    return () => {
      setOnGameCreated(null);
    };
  }, [router, setOnGameCreated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pseudo.trim()) {
      setError('Veuillez entrer un pseudo');
      return;
    }

    if (pseudo.length < 2 || pseudo.length > 20) {
      setError('Le pseudo doit contenir entre 2 et 20 caractères');
      return;
    }

    createGame(pseudo.trim(), {
      phases: DEFAULT_PHASES,
      timePerPhase,
    });
    setIsCreating(true);

  };
  if (isCreating) {
    return (
      <div className="min-h-screen flex-col gap-4 flex items-center justify-center">
          <Loader />
          <p className="font-bold">Création de la partie...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-base-300 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{opacity: 0, filter: 'blur(8px)', scale: 0.8 }}
          animate={{opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{duration: 0.2, ease:'easeOut'}}
          className="bg-base-100 rounded-2xl shadow-xl p-8 animate-fade-in"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">
            Créer une partie
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              value={pseudo}
              className='text-primary'
              onChange={(e) => {
                setPseudo(e.target.value);
                setError('');
              }}
              placeholder="Entrez votre pseudo"
              maxLength={20}
              autoFocus
            />

            <div>
              <label className="block text-sm font-medium  mb-2">
                Temps par phase (secondes)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="10"
                  max="180"
                  step="10"
                  value={timePerPhase}
                  onChange={(e) => setTimePerPhase(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-semibold w-12 text-right">
                  {timePerPhase}s
                </span>
              </div>
            </div>

            <div className="bg-neutral rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2">Phases du jeu</h3>
              <ol className="text-sm  space-y-1 list-decimal list-inside">
                {DEFAULT_PHASES.map((phase, index) => (
                  <li key={index}>{phase}</li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/80" size="lg">
                Créer la partie
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/')}
                variant="ghost"
                className="w-full hover:bg-error"
              >
                Retour
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}