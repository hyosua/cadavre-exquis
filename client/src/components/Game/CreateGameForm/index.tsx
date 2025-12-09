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
import { personnalityConfig } from "./AIConfig/AIPlayerCard";
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
    const allPersonalities = Object.keys(personnalityConfig) as Personnality[];
    const availablePersonalities = allPersonalities.filter(
      (name) => !aiPlayers.some((ai) => ai.pseudo === name)
    );

    if (availablePersonalities.length === 0) return;

    const randomPersonality =
      availablePersonalities[
        Math.floor(Math.random() * availablePersonalities.length)
      ];

    // On récupère le label associé (ex: "Le Pirate")
    const nameFromConfig = personnalityConfig[randomPersonality].label;

    const newAi: AIPlayer = {
      id: `ai-${Date.now()}`,
      pseudo: nameFromConfig,
      isAi: true,
      isHost: false,
      personnality: randomPersonality,
      isConnected: true,
      hasPlayedCurrentPhase: false,
    };

    setAiPlayers([...aiPlayers, newAi]);
  };

  const removeAiPlayer = (aiPlayer: string) => {
    setAiPlayers(aiPlayers.filter((ai) => ai.id !== aiPlayer));
  };

  const handlePersonnalityChange = (
    id: string,
    newPersonnality: Personnality
  ) => {
    const newName = personnalityConfig[newPersonnality].label;

    setAiPlayers(
      aiPlayers.map((ai) =>
        ai.id === id
          ? { ...ai, personnality: newPersonnality, pseudo: newName }
          : ai
      )
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

      await createGame(data.pseudo, config);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 flex justify-center py-10">
      <div className="max-w-2xl w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* STYLE POP-CARD */}
              <Card className="pop-card p-0 overflow-hidden">
                <CardHeader className="bg-primary text-primary-foreground border-b-2 border-foreground p-4 sm:p-6">
                  <motion.div variants={itemVariants} className="text-center">
                    <CardTitle className="text-3xl font-averia font-bold -rotate-1 drop-shadow-sm">
                      Créer une partie
                    </CardTitle>
                    <p className="text-primary-foreground/80 text-xl font-averia mt-1">
                      Configurez votre jeu.
                    </p>
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-8  sm:p-8 bg-card">
                  {/* Pseudo */}
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="pseudo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg  text-primary font-bold font-averia flex items-center gap-2">
                            <span className="bg-primary text-background w-6 h-6 rounded-full flex items-center justify-center text-xs">
                              1
                            </span>
                            Votre Pseudo
                          </FormLabel>
                          <FormControl>
                            {/* STYLE POP-INPUT */}
                            <Input
                              placeholder="Emil_z0la"
                              {...field}
                              className="pop-input h-12 text-lg lg:text-xl"
                            />
                          </FormControl>
                          <FormMessage className="text-destructive font-bold" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Mode de jeu */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <div className="text-lg text-primary font-bold font-averia flex items-center gap-2">
                      <span className="bg-primary text-background w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        2
                      </span>
                      Structure de la phrase
                    </div>
                    <GameModeSelector control={form.control} />
                  </motion.div>

                  {/* Joueurs IA */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <div className="flex text-primary items-center gap-2">
                      <span className="bg-primary text-background w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </span>
                      <h3 className="text-lg font-bold font-averia">
                        Les Robots
                      </h3>
                    </div>
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
                          <FormLabel className="text-lg text-primary font-bold font-averia flex items-center gap-2">
                            <span className="bg-primary text-background w-6 h-6 rounded-full flex items-center justify-center text-xs">
                              4
                            </span>
                            Pression Temporelle
                          </FormLabel>
                          <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-xl border-2 border-foreground/10">
                            <FormControl>
                              <Slider
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                max={120}
                                min={30}
                                step={5}
                                className="flex-1 cursor-pointer"
                              />
                            </FormControl>
                            <span className="pop-tag bg-muted text-muted-foreground font-mono text-xl font-bold w-20 text-center py-2">
                              {field.value?.[0] || 30}s
                            </span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </CardContent>

                <CardFooter className="flex sm:flex-row justify-center gap-4 p-6 bg-muted/30 border-t-2 border-foreground/10">
                  <motion.div variants={itemVariants} className="w-1/2">
                    <Button
                      asChild
                      // STYLE POP-BTN GHOST
                      className="pop-btn bg-muted/20 hover:bg-muted border-2 w-full text-foreground hover:text-muted-foreground h-12 font-bold"
                      disabled={isCreating}
                    >
                      <Link href="/">Annuler</Link>
                    </Button>
                  </motion.div>
                  <motion.div variants={itemVariants} className="w-1/2">
                    <LoadingButton
                      type="submit"
                      // STYLE POP-BTN PRIMARY
                      className="pop-btn bg-primary text-primary-foreground hover:bg-primary/90 w-full h-12 text-lg font-bold"
                      loading={isCreating}
                      loadingText="Création..."
                    >
                      Créer !
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
