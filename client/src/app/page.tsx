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
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="min-h-screen flex  justify-center py-16 p-4">
      <div className="max-w-3xl w-full flex flex-col gap-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h1 className="text-5xl font-title sm:text-8xl font-bold text-secondary ">Cadavre Exquis</h1>
          <div className="mt-4 font-averia min-h-[2rem] sm:min-h-[3rem]">
            <TypeText />
          </div>
        </motion.div>

          <motion.div 
            className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)'}}
            transition={{ duration: 0.3 }}
            >
                <Button
                  onClick={() => router.push('/create')}
                  variant="ghost"
                  className="h-12 red-glow-shadow  rounded-xl hover:bg-base-200 hover:border-secondary hover:text-secondary cursor-pointer"
                >
                  Créer une partie
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => router.push('/join')}
                  className="h-12 glow-shadow rounded-xl hover:bg-base-200 hover:text-primary hover:border hover:border-primary cursor-pointer"
                >
                  Rejoindre une partie
                </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Collapsible className="bg-neutral rounded-2xl shadow-xl p-6">
              <CollapsibleTrigger className="space-y-1 flex justify-between items-center w-full">
                <h2 className="text-xl font-semibold">Créez des phrases loufoques à plusieurs !</h2>
                <ChevronDown />
              </CollapsibleTrigger>

              <CollapsibleContent className=" mt-2">
                <ol className="list-none space-y-4 pt-4">
                  {/* ÉTAPE 1: Création */}
                  <li className="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
                    <div className="flex-shrink-0 text-2xl font-extrabold text-base-content/80 w-8 text-center">1.</div>
                    <div>
                      <p className="text-base sm:text-lg text-base-content">
                        Un joueur crée une partie et <span className='font-bold'>partage le code</span>.
                      </p>
                    </div>
                  </li>

                  {/* ÉTAPE 2: Écriture */}
                  <li className="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
                    <div className="flex-shrink-0 text-2xl font-extrabold text-base-content/80 w-8 text-center">2.</div>
                    <div>
                      <p className="text-base sm:text-lg text-base-content">
                        À chaque phase, les joueurs contribuent <span className='font-bold'>simultanément</span> en écrivant un mot correspondant à une <span className='font-bold'>catégorie grammaticale</span> : Nom, Adjectif, Verbe, etc.
                      </p>
                    </div>
                  </li>

                  {/* ÉTAPE 3: Rotation */}
                  <li className="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
                    <div className="flex-shrink-0 text-2xl font-extrabold text-base-content/80 w-8 text-center">3.</div>
                    <div>
                      <p className="text-base sm:text-lg text-base-content">
                        Les mots de tous les joueurs sont assemblés pour former les <span className='font-bold'>phrases finales</span>.                      </p>
                    </div>
                  </li>

                  {/* ÉTAPE 4: Vote */}
                  <li className="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
                    <div className="flex-shrink-0 text-2xl font-extrabold text-base-content/80 w-8 text-center">4.</div>
                    <div>
                      <p className="text-base sm:text-lg text-base-content">
                        <span className='font-bold'>Votez</span> pour la phrase la plus innatendue ou la plus drôle!
                      </p>
                    </div>
                  </li>
                  
                  {/* ÉTAPE 5: Résultat */}
                  <li className="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
                    <div className="flex-shrink-0 text-2xl font-extrabold text-base-content/80 w-8 text-center">5.</div>
                    <div>
                      <p className="text-base sm:text-lg text-base-content">
                        Découvrez le <span className='font-bold'>classement final</span>.
                      </p>
                    </div>
                  </li>

                  {/* ÉTAPE 6: Rejouez */}
                  <li className="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
                    <div className="flex-shrink-0 text-2xl font-extrabold text-base-content/80 w-8 text-center">6.</div>
                    <div>
                      <p className="text-base sm:text-lg text-base-content">
                        <span className='font-bold'>Rejouez ?</span>
                      </p>
                    </div>
                  </li>

                </ol>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>


      </div>
    </div>
  );
}
