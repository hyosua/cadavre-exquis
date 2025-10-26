'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGame } from '@/hooks/useGame';
import { useSocket } from '@/hooks/useSocket';
import { GameLobby } from '@/components/Game/GameLobby';
import { GamePhase } from '@/components/Game/GamePhase';
import { VotingPhase } from '@/components/Game/VotingPhase';
import { Results } from '@/components/Game/Results';
import Loader from '@/components/ui/loader';


export default function Game() {
  const router = useRouter();
  const params = useParams();
  const { game, error } = useGame();
  useSocket();
  useEffect(() => {
    if (error) {
      alert(error);
      router.push('/');
    }
  }, [error, router]);

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
          <Loader />
      </div>
    );
  }

  return (
    <>
      {game.status === 'waiting' && <GameLobby />}
      {game.status === 'playing' && <GamePhase />}
      {game.status === 'voting' && <VotingPhase />}
      {game.status === 'finished' && <Results />}
    </>
  );
}