'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { phrases } from '@/lib/phrases';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useEffect, useMemo, useRef, useState } from 'react';

// Small typewriter text animation component
function TypeText({

  typingSpeed = 70,
  pause = 950,
}: {
  phrases?: string[];
  typingSpeed?: number; // ms per character
  pause?: number; // ms before next phrase
}) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);
  const current = useMemo(() => phrases[index % phrases.length], [phrases, index]);

  useEffect(() => {
    const blinkTimer = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(blinkTimer);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!deleting && subIndex < current.length) {
        setSubIndex((v) => v + 1);
        return;
      }
      if (!deleting && subIndex === current.length) {
        setDeleting(true);
        return;
      }
      if (deleting && subIndex > 0) {
        setSubIndex((v) => v - 1);
        return;
      }
      if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex((i) => i + 1);
      }
    }, deleting ? Math.max(typingSpeed / 2, 25) : (subIndex === current.length ? pause : typingSpeed));

    return () => clearTimeout(timeout);
  }, [current, deleting, pause, subIndex, typingSpeed]);

  return (
    <div className="mx-auto inline-flex items-center text-2xl sm:text-4xl text-base-content">
      <span className="whitespace-pre">{current.slice(0, subIndex)}</span>
      <span className={`ml-0.5 h-6 w-[2px] bg-gray-800 ${blink ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="min-h-screen bg-base-300 flex  justify-center py-16 p-4">
      <div className="max-w-3xl w-full flex flex-col gap-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-title sm:text-8xl font-bold text-secondary ">Cadavre Exquis</h1>
          <div className="mt-4 font-averia ">
            <TypeText />
          </div>
        </motion.div>

          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => router.push('/create')}
                  variant="ghost"
                  className="h-12  border border-base-content rounded-xl hover:bg-base-200 hover:border-primary hover:text-primary cursor-pointer"
                >
                  Créer une partie
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => router.push('/join')}
                  className="h-12   rounded-xl hover:bg-base-200 hover:text-primary hover:border hover:border-primary cursor-pointer"
                >
                  Rejoindre une partie
                </Button>
          </div>

           <Collapsible className="bg-neutral rounded-2xl shadow-xl p-6">
            <CollapsibleTrigger className="space-y-1 flex justify-between items-center w-full">
              <h2 className="text-xl font-semibold">Comment jouer&nbsp;?</h2>
              <ChevronDown />
            </CollapsibleTrigger>

            <CollapsibleContent className="pt-4 mt-2">
              <ol className="list-decimal pl-8 space-y-2 text-sm flex flex-col items-start sm:text-lg">
                <li>Un joueur crée une partie et partage le code</li>
                <li>Chaque joueur écrit un mot à chaque phase</li>
                <li>Les phrases tournent entre les joueurs</li>
                <li>Votez pour votre phrase préférée</li>
                <li>Découvrez le classement final</li>
              </ol>
            </CollapsibleContent>
          </Collapsible>

      </div>
    </div>
  );
}
