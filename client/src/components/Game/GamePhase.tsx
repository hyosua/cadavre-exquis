'use client';

import React, { useState } from 'react';
import { useGame } from '@/hooks/useGame';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer } from '@/components/ui/Timer';
import { PlayerList } from '@/components/Game/Playerlist';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';

const MotionButton = motion(Button)

export function GamePhase() {
  const { game, currentPlayer, timeLeft, submitWord, hasPlayedCurrentPhase, getCurrentSentence } = useGame();
  const [word, setWord] = useState('');

  const buttonControls = useAnimationControls();

  if (!game || !currentPlayer) return null;

  const phaseKey = game.config.phases[game.currentPhase]
  const phaseDetails = game.config.phaseDetails[phaseKey]
  const currentPhaseLabel = phaseDetails.titre;
  const helper = phaseDetails.helper
  const placeholder = phaseDetails.placeholder
  const hasPlayed = hasPlayedCurrentPhase();
  const currentSentence = getCurrentSentence();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim()) {
      await buttonControls.start({
        scale: [1, 1.1, 1], // Animation "Pop"
        transition: { duration: 0.2, ease: "easeOut" }
      });
      submitWord(word.trim());
      setWord('');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto mt-8">
        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)", scale: 0.8 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-base-neutral flex items-center justify-center flex-col rounded-2xl shadow-xl p-8 "
        >
          <div className="text-center mb-2">
            <h1 className="text-3xl font-bold mb-2">
              Phase{" "}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={game.currentPhase}
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {game.currentPhase + 1}
                </motion.span>
              </AnimatePresence>{" "}
              / {game.config.phases.length}
            </h1>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={currentPhaseLabel}
                className="text-3xl sm:text-5xl text-primary font-semibold"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {currentPhaseLabel.toUpperCase()}
              </motion.p>
            </AnimatePresence>
            <span className="text-xl italic font-semibold">{helper}</span>
          </div>

          <Timer timeLeft={timeLeft} totalTime={game.config.timePerPhase} />

          <div className="mt-6 grid gap-6 w-full">
            <div>
              <AnimatePresence>
                {currentSentence && currentSentence.words.length > 0 && (
                  <motion.div
                    key="current-sentence" // Clé statique car il n'y a qu'un seul élément
                    className="bg-neutral border border-neutral rounded-lg p-4 mb-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-sm font-semibold  mb-2">
                      Phrase en cours
                    </h3>
                    <p className="text-lg font-medium">
                      {currentSentence.words.join(" ")}...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {!hasPlayed ? (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    key="form"
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: "easeIn" }}
                  >
                    <Input
                      value={word}
                      className="placeholder:text-gray-400 sm:text-lg placeholder:text-sm sm:placeholder:text-base placeholder:truncate"
                      onChange={(e) => setWord(e.target.value)}
                      placeholder={placeholder}
                      maxLength={50}
                      autoFocus
                    />
                    <MotionButton
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={!word.trim()}
                      whileTap={{ scale: 0.95 }}
                    >
                      Valider
                    </MotionButton>
                  </motion.form>
                ) : (
                  <motion.div
                    key="confirmation"
                    className=" border-success rounded-lg p-2 text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.05 },
                    }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                  >
                    <motion.p
                      className="text-success font-semibold text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [1, 0.6, 1] }}
                      transition={{
                        duration: 2.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      En attente des autres joueurs...
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <PlayerList
                players={game.players}
                currentPlayerId={currentPlayer.id}
                showPlayedStatus={true}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}