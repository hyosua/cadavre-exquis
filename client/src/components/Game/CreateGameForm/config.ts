import * as z from "zod";
import { GAME_PRESETS, GamePreset } from "@/config/config";

export const gameConfigSchema = z.object({
  pseudo: z.string().min(2, { 
    message: "Votre pseudo doit faire au moins 2 caractères." 
  }),
  presetId: z.string().min(1, { 
    message: "Veuillez sélectionner un mode de jeu." 
  }),
  phases: z.array(z.string()).min(1, { 
    message: "Veuillez sélectionner au moins une phase." 
  }),
  timePerPhase: z.array(z.number()),
});

export type GameConfigValues = z.infer<typeof gameConfigSchema>;

// groupedPresets permet de grouper les presets selon leur difficulté
/*
Attendu:
{
  facile: [presetA, presetB],
  moyen: [presetC],
  difficile: [presetD, presetE],
}
*/
export const groupedPresets = GAME_PRESETS.reduce((acc, preset) => {
  // si la difficulté n'existe pas encore, on crée un tableau vide.
  if (!acc[preset.difficulty]) acc[preset.difficulty] = [];
  acc[preset.difficulty].push(preset);

  return acc;
}, {} as Record<GamePreset["difficulty"], GamePreset[]>);



export const difficultyLabels: Record<GamePreset["difficulty"], string> = {
  facile: "Facile",
  moyen: "Moyen",
  difficile: "Difficile",
};

export const DEFAULT_VALUES: GameConfigValues = {
  pseudo: "",
  presetId: "type_adj",
  phases: ['s', 'adj', 'v', 'cod'],
  timePerPhase: [60],
};