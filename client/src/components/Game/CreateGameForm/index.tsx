"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useGame } from "@/hooks/useGame";
import { useGameStore } from "@/store/gameStore";
import { GameConfig } from "@/types/game.type";
import { PHASE_DETAILS, GAME_PRESETS } from "@/config/config";

import { Button } from "@/components/ui/button";
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
import { CustomPhasesSelector } from "./CustomPhaseSelector";

export function CreateGameForm() {
  const router = useRouter();
  const { createGame } = useGame();
  const setOnGameCreated = useGameStore((s) => s.setOnGameCreated);

  const form = useForm<GameConfigValues>({
    resolver: zodResolver(gameConfigSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const selectedPresetId = form.watch("presetId");
  const { isSubmitting } = form.formState;

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
    setOnGameCreated((gameId) => router.push(`/game/${gameId}`));
    return () => setOnGameCreated(null);
  }, [router, setOnGameCreated]);

  const onSubmit = (data: GameConfigValues) => {
    const selectedPhaseDetails = data.phases.reduce((acc, phaseKey) => {
      acc[phaseKey] = PHASE_DETAILS[phaseKey];
      return acc;
    }, {} as Record<string, any>);

    const config: GameConfig = {
      phases: data.phases,
      timePerPhase: data.timePerPhase[0],
      phaseDetails: selectedPhaseDetails,
    };

    createGame(data.pseudo, config);
  };

  return (
    <div className="bg-base-300 min-h-screen p-4">
      <div className="max-w-2xl mx-auto mt-2 sm:mt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Créer une nouvelle partie</CardTitle>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Pseudo */}
                <FormField
                  control={form.control}
                  name="pseudo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Pseudo
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom de joueur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mode de jeu */}
                <GameModeSelector control={form.control} />

                {/* Composition personnalisée */}
                {selectedPresetId === "custom" && (
                  <CustomPhasesSelector control={form.control} />
                )}

                {/* Temps par phase */}
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
                        <span className="font-mono text-lg font-bold w-16 text-center text-primary bg-muted rounded-md px-2 py-1">
                          {field.value?.[0] || 30}s
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Créer la partie
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
