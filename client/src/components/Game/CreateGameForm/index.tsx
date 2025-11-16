"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useGame } from "@/hooks/useGame";
import { useGameStore } from "@/store/gameStore";
import { AIPlayer, GameConfig, PhaseDetail } from "@/types/game.type";
import { PHASE_DETAILS, GAME_PRESETS } from "@/config/config";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { gameConfigSchema, GameConfigValues, DEFAULT_VALUES } from "./config";
import { GameModeSelector } from "./GameModeSelector";
import { motion } from "framer-motion";
import Link from "next/link";

import { Personnality } from "@/types/game.type";
import { AIPlayersList } from "./AIConfig/AIPlayersList";
// Variants pour le conteneur principal
const containerVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Variants pour les éléments enfants
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const AI_NAMES = ["Alpha", "Gamma", "Zeta", "Beta"];

export function CreateGameForm() {
  const router = useRouter();
  const { createGame } = useGame();
  const setOnGameCreated = useGameStore((s) => s.setOnGameCreated);
  const [isCreating, setIsCreating] = useState(false);
  const [aiPlayers, setAiPlayers] = useState<AIPlayer[]>([]);

  const form = useForm<GameConfigValues>({
    resolver: zodResolver(gameConfigSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const selectedPresetId = form.watch("presetId");

  // Mise à jour des phases selon le preset sélectionné
  useEffect(() => {
    if (selectedPresetId === "custom") {
      form.setValue("phases", []);
    } else {
      const preset = GAME_PRESETS.find((p) => p.id === selectedPresetId);
      if (preset) form.setValue("phases", preset.phases);
    }
  }, [selectedPresetId, form]);

  // Configuration de la navigation après création
  useEffect(() => {
    setOnGameCreated((gameId) => {
      setIsCreating(false);
      router.push(`/game/${gameId}`);
    });
    return () => setOnGameCreated(null);
  }, [router, setOnGameCreated]);

  const addAiPlayer = () => {
    const availableNames = AI_NAMES.filter(
      (name) => !aiPlayers.some((ai) => ai.pseudo === name)
    );

    if (availableNames.length === 0) return;

    const newAi: AIPlayer = {
      id: `ai-${Date.now()}`,
      pseudo: availableNames[Math.floor(Math.random() * availableNames.length)],
      isAi: true,
      isHost: false,
      personnality: "comique",
      isConnected: true,
      hasPlayedCurrentPhase: false,
    };

    setAiPlayers([...aiPlayers, newAi]);
  };

  const removeAiPlayer = (aiPlayer: string) => {
    setAiPlayers(aiPlayers.filter((ai) => ai.id !== aiPlayer));
  };

  const handlePersonnalityChange = (id: string, personnality: Personnality) => {
    setAiPlayers(
      aiPlayers.map((ai) => (ai.id === id ? { ...ai, personnality } : ai))
    );
  };

  const onSubmit = async (data: GameConfigValues) => {
    setIsCreating(true);

    try {
      const selectedPhaseDetails = data.phases.reduce((acc, phaseKey) => {
        acc[phaseKey] = PHASE_DETAILS[phaseKey];
        return acc;
      }, {} as Record<string, PhaseDetail>);

      const config: GameConfig = {
        phases: data.phases,
        timePerPhase: data.timePerPhase[0],
        phaseDetails: selectedPhaseDetails,
        aiPlayers: aiPlayers,
      };

      console.log("→ Game config envoyée :", config);
      await createGame(data.pseudo, config);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-muted/70">
      <div className="max-w-2xl mx-auto mt-2 sm:mt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Card>
                <CardHeader>
                  <motion.div variants={itemVariants}>
                    <CardTitle>Créer une nouvelle partie</CardTitle>
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-8">
                  {/* Pseudo */}
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="pseudo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">
                            Pseudo
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Votre nom de joueur"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Mode de jeu */}
                  <motion.div variants={itemVariants}>
                    <GameModeSelector control={form.control} />
                  </motion.div>

                  {/* Joueurs IA */}
                  <motion.div variants={itemVariants}>
                    <AIPlayersList
                      aiPlayers={aiPlayers}
                      onAdd={addAiPlayer}
                      onRemove={removeAiPlayer}
                      onPersonnalityChange={handlePersonnalityChange}
                      maxPlayers={3}
                    />
                  </motion.div>

                  {/* Temps par phase */}
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="timePerPhase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">
                            Temps par phase
                          </FormLabel>
                          <div className="flex items-center gap-4">
                            <FormControl>
                              <Slider
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                max={120}
                                min={30}
                                step={5}
                                className="flex-1"
                              />
                            </FormControl>
                            <span className="font-mono text-lg font-bold w-16 text-center text-primary rounded-md px-2 py-1">
                              {field.value?.[0] || 30}s
                            </span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </CardContent>

                <CardFooter className="flex sm:flex-row justify-center gap-2 sm:gap-8">
                  <motion.div variants={itemVariants} className="w-1/2">
                    <Button
                      asChild
                      variant={"ghost"}
                      size="lg"
                      className="w-full"
                      disabled={isCreating}
                    >
                      <Link href="/">Annuler</Link>
                    </Button>
                  </motion.div>
                  <motion.div variants={itemVariants} className="w-1/2">
                    <LoadingButton
                      type="submit"
                      size="lg"
                      className="w-full"
                      loading={isCreating}
                      loadingText="Création..."
                    >
                      Créer la partie
                    </LoadingButton>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          </form>
        </Form>
      </div>
    </div>
  );
}
