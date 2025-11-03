"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod"; // Assurez-vous que z est importé
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// 1. Imports pour la logique
import { useGame } from "@/hooks/useGame";
import { useGameStore } from "@/store/gameStore";
import { GameConfig, phaseDetail } from "@/types/game.type";
import {
  PHASE_DETAILS,
  GAME_PRESETS,
  GamePreset,
} from "@/config/config";
import { cn } from "@/lib/utils";

// 2. Imports pour l'UI (shadcn/ui)
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";


// 3.1 Schéma Zod
const gameConfigSchema = z.object({
  pseudo: z.string().min(2, {
    message: "Votre pseudo doit faire au moins 2 caractères.",
  }),

  presetId: z.string().min(1, {
    message: "Veuillez sélectionner un mode de jeu.",
  }),
  phases: z.array(z.string()).min(1, {
    message: "Veuillez sélectionner au moins une phase.",
  }),
  timePerPhase: z.array(z.number()),
});

// 3.2 Type inféré du schéma
type GameConfigValues = z.infer<typeof gameConfigSchema>;

// 3.3 Regroupement des presets pour l'Accordion
const groupedPresets = GAME_PRESETS.reduce((acc, preset) => {
  const { difficulty } = preset;
  if (!acc[difficulty]) {
    acc[difficulty] = [];
  }
  acc[difficulty].push(preset);
  return acc;
}, {} as Record<GamePreset["difficulty"], GamePreset[]>);

// 3.4 Labels pour les difficultés
const difficultyLabels: Record<GamePreset["difficulty"], string> = {
  facile: "Facile",
  moyen: "Moyen",
  difficile: "Difficile",
};

//
// 4. COMPOSANT REACT
//
export function CreateGameForm() {
  const router = useRouter();
  const { createGame } = useGame();
  const setOnGameCreated = useGameStore((s) => s.setOnGameCreated);

  // <-- CORRECTION (TypeScript): useForm peut maintenant inférer le type correctement
  const form = useForm<GameConfigValues>({
    resolver: zodResolver(gameConfigSchema), // <-- Ne devrait plus avoir d'erreur
    defaultValues: {
      pseudo: "",
      presetId: "type_a",
      phases: ["s", "v", "cod"],
      timePerPhase: [60],
    },
  });
  const { isSubmitting } = form.formState;

  const selectedPresetId = form.watch("presetId");

  useEffect(() => {
    if (selectedPresetId === "custom") {
      form.setValue("phases", []);
    } else {
      const preset = GAME_PRESETS.find((p) => p.id === selectedPresetId);
      if (preset) {
        form.setValue("phases", preset.phases);
      }
    }
    // 'form' est plus stable que 'form.setValue' comme dépendance
  }, [selectedPresetId, form]);

  useEffect(() => {
    setOnGameCreated((gameId) => {
      router.push(`/game/${gameId}`);
    });
    return () => setOnGameCreated(null);
  }, [router, setOnGameCreated]);

  // <-- CORRECTION (TypeScript): 'data' est maintenant correctement typé en GameConfigValues
  function onSubmit(data: GameConfigValues) {
    const selectedPhaseDetails = data.phases.reduce((acc, phaseKey) => {
      acc[phaseKey] = PHASE_DETAILS[phaseKey];
      return acc;
    }, {} as Record<string, phaseDetail>);

    const config: GameConfig = {
      phases: data.phases,
      timePerPhase: data.timePerPhase[0],
      phaseDetails: selectedPhaseDetails,
    };

    createGame(data.pseudo, config);
  }

  return (
    <div className="bg-base-300 min-h-screen p-4">
      <div className="max-w-2xl mx-auto mt-2 sm:mt-8">
        <Form {...form}>
          {/* <-- CORRECTION (TypeScript): form.handleSubmit est maintenant correct */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Créer une nouvelle partie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Champ Pseudo */}
                <FormField
                  // <-- CORRECTION (TypeScript): 'form.control' est maintenant du bon type
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

                {/* Sélecteur de Mode de Jeu */}
                <FormField
                  // <-- CORRECTION (TypeScript): 'form.control' est maintenant du bon type
                  control={form.control}
                  name="presetId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-lg font-semibold">
                        Mode de jeu
                      </FormLabel>
                      <FormDescription>
                        Choisissez un type de structure de phrase pour la
                        partie.
                      </FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="w-full"
                        >
                          <Accordion
                            type="multiple"
                            defaultValue={["facile"]}
                            className="w-full"
                          >
                            {Object.entries(groupedPresets).map(
                              ([difficulty, presets]) => (
                                <AccordionItem
                                  key={difficulty}
                                  value={difficulty}
                                >
                                  <AccordionTrigger className="text-base">
                                    {/* <-- CORRECTION (ts 7053): Caster 'difficulty' */}
                                    {
                                      difficultyLabels[
                                        difficulty as GamePreset["difficulty"]
                                      ]
                                    }
                                  </AccordionTrigger>
                                  <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                                    {presets.map((preset) => (
                                      <FormItem key={preset.id}>
                                        <FormControl>
                                          <RadioGroupItem
                                            value={preset.id}
                                            id={preset.id}
                                            className="peer sr-only"
                                          />
                                        </FormControl>
                                        <Label
                                          htmlFor={preset.id}
                                          className={cn(
                                            "flex flex-col rounded-lg border-2 border-muted bg-popover p-4",
                                            "hover:bg-accent hover:text-accent-foreground",
                                            "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                          )}
                                        >
                                          <span className="font-semibold mb-1">
                                            {preset.name}
                                          </span>
                                          <span className="text-sm text-muted-foreground">
                                            {/* <-- CORRECTION (ESLint): Échapper les guillemets */}
                                            <em>
                                              &quot;{preset.example}&quot;
                                            </em>
                                          </span>
                                        </Label>
                                      </FormItem>
                                    ))}
                                  </AccordionContent>
                                </AccordionItem>
                              )
                            )}
                          </Accordion>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Affichage conditionnel des Checkboxes */}
                {selectedPresetId === "custom" && (
                  <FormField
                    control={form.control}
                    name="phases"
                    render={() => (
                      <FormItem className="rounded-lg border bg-muted/30 p-4">
                        <FormLabel className="text-lg font-semibold">
                          Composition personnalisée
                        </FormLabel>
                        <FormDescription>
                          Cochez les éléments qui composeront la phrase finale.
                        </FormDescription>
                        <div className="space-y-3 pt-3">
                          {Object.entries(PHASE_DETAILS).map(
                            ([key, detail]) => (
                              <FormField
                                key={key}
                                control={form.control}
                                name="phases"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border bg-background p-4">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(key)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                key,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (id) => id !== key
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-normal">
                                        {detail.titre}
                                      </FormLabel>
                                      <FormDescription>
                                        <em>&quot;{detail.helper}&quot;</em>
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            )
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Champ Temps */}
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
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
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

