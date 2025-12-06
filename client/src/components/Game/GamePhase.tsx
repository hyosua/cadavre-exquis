"use client";

import React, { useState } from "react";
import { useGame } from "@/hooks/useGame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer } from "@/components/ui/Timer";
import { PlayerList } from "@/components/Game/Playerlist";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Confirm } from "../ui/confirm";
import { PhaseSteps } from "./PhaseSteps";

export function GamePhase() {
  const {
    game,
    currentPlayer,
    timeLeft,
    submitWord,
    hasPlayedCurrentPhase,
    leaveGame,
  } = useGame();
  const [word, setWord] = useState("");
  const buttonControls = useAnimationControls();

  if (!game || !currentPlayer) return null;

  const phaseKey = game.config.phases[game.currentPhase];
  const phaseDetails = game.config.phaseDetails[phaseKey];
  const currentPhaseLabel = phaseDetails.titre;
  const helper = phaseDetails.helper;
  const placeholder = phaseDetails.placeholder;
  const hasPlayed = hasPlayedCurrentPhase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim()) {
      // Petite animation JS en plus du CSS pour le fun
      await buttonControls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.2 },
      });
      submitWord(word.trim());
      setWord("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
      // APPLICATION DU STYLE LOUFOQUE ICI : pop-card
      className="pop-card flex items-center justify-center flex-col p-6 sm:p-10 max-w-2xl mx-auto w-full"
    >
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center justify-center gap-2 bg-secondary/20 px-4 py-1 rounded-full border-2 border-foreground/10 mb-2">
          <span className="font-bold text-sm uppercase tracking-widest text-foreground">
            Manche
          </span>
          <h1 className="text-2xl font-bold text-foreground">
            {/* Animation du chiffre */}
            <AnimatePresence mode="wait">
              <motion.span
                key={game.currentPhase}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="inline-block"
              >
                {game.currentPhase + 1}
              </motion.span>
            </AnimatePresence>
            <span className="mx-1">/</span>
            {game.config.phases.length}
          </h1>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhaseLabel}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <p className="text-4xl sm:text-6xl text-primary font-averia font-bold drop-shadow-sm rotate-1">
              {currentPhaseLabel}
            </p>
          </motion.div>
        </AnimatePresence>

        <p className="text-lg sm:text-xl font-medium text-muted-foreground font-averia">
          {helper}
        </p>
      </div>

      <div className="w-full mb-8">
        <Timer timeLeft={timeLeft} totalTime={game.config.timePerPhase} />
      </div>

      <PhaseSteps
        phases={game.config.phases}
        currentPhase={game.currentPhase}
      />

      <div className="mt-8 grid gap-8 w-full">
        <div className="relative min-h-[120px]">
          <AnimatePresence mode="wait">
            {!hasPlayed ? (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* APPLICATION DU STYLE INPUT */}
                <Input
                  value={word}
                  className="pop-input h-14 text-xl lg:text-2xl font-bold"
                  onChange={(e) => setWord(e.target.value)}
                  placeholder={placeholder}
                  maxLength={50}
                  autoFocus
                />

                {/* APPLICATION DU STYLE BOUTON */}
                <Button
                  type="submit"
                  // On enlève le variant par défaut souvent pour laisser pop-btn gérer
                  className="pop-btn w-full h-12 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!word.trim()}
                >
                  Valider !
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="confirmation"
                className="bg-secondary/10 border-2 border-dashed border-secondary rounded-xl p-6 text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-4xl mb-2"
                >
                  ⏳
                </motion.div>
                <p className="text-foreground font-bold text-lg">
                  C&apos;est noté !
                </p>
                <p className="text-muted-foreground">
                  On attend les retardataires...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4 pt-4 border-t-2 border-dashed border-foreground/20">
          <PlayerList
            players={game.players}
            currentPlayerId={currentPlayer.id}
            showPlayedStatus={true}
          />

          <div className="flex justify-center">
            <Confirm
              message="Voulez-vous vraiment abandonner vos amis ?"
              buttonName="Quitter la partie"
              // Tu peux aussi styliser le bouton de Confirm via une prop className si ton composant l'accepte
              className="pop-btn bg-destructive text-destructive-foreground hover:bg-destructive/90 w-auto px-6"
              onConfirm={leaveGame}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
