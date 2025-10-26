'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { useSocket } from '@/hooks/useSocket';
import Loader from '@/components/ui/loader';


export default function JoinGame() {
  useSocket();
  const router = useRouter();
  const { joinGame, game } = useGame();
  const [pseudo, setPseudo] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (game && isJoining) {
      router.push(`/game/${game.id}`);
    }
  }, [game, isJoining, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pseudo.trim()) {
      setError('Veuillez entrer un pseudo');
      return;
    }

    if (!code.trim()) {
      setError('Veuillez entrer le code de la partie');
      return;
    }

    if (code.length !== 6) {
      setError('Le code doit contenir 6 caractères');
      return;
    }
    joinGame(code.toUpperCase(), pseudo.trim());
    setIsJoining(true); 
  };
  
  if (isJoining) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
          <Loader />
          <p className="font-bold">Connexion à la partie...</p>
          <p className="text-sm ">Code: {code}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-neutral rounded-2xl shadow-xl p-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Rejoindre une partie
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              value={pseudo}
              onChange={(e) => {
                setPseudo(e.target.value);
                setError('');
              }}
              placeholder="Entrez votre pseudo"
              maxLength={20}
              className='text-primary'
              autoFocus
            />

            <Input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="ABC123"
              maxLength={6}
              className="uppercase font-mono text-center text-2xl tracking-wider"
            />

            {error && (
              <div className=" border bg-error/15 border-error rounded-lg p-3">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <Button type="submit" className="w-full">
                Rejoindre
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/')}
                variant={"ghost"}
                className="w-full hover:bg-error"
              >
                Retour
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}