import { z } from 'zod';
const phaseKeySchema = z.enum([
  "s", "adj", "v", "cod", "cc",
  "ve", "coi", "atts", "pp", "sub",
  "ccl", "cct", "ccm", "gns", "adv"
]);

const phaseDetailSchema = z.object({
  titre: z.string(),
  helper: z.string(),
  placeholder: z.string(),
});

const gameConfigSchema = z.object({
  phases: z.array(phaseKeySchema).min(1),
  phaseDetails: z.record(z.string(), phaseDetailSchema),
  timePerPhase: z.number().min(10).max(300),
  aiPlayers: z.array(z.object({
    id: z.string(),
    pseudo: z.string().min(2).max(20),
    isHost: z.literal(false),
    hasPlayedCurrentPhase: z.literal(false),
    isConnected: z.literal(true),
    isAi: z.literal(true),
    creativity: z.enum(["strict", "equilibre", "creatif"]),
  })).optional().default([]),
});

export const createGameSchema = z.object({
  pseudo: z.string().min(2).max(20),
  config: gameConfigSchema,
});

export const joinGameSchema = z.object({
  code: z.string().length(6),
  pseudo: z.string().min(2).max(20),
});

export const submitWordSchema = z.object({
  gameId: z.string(),
  word: z.string().min(1).max(50),
});

export const voteSchema = z.object({
  gameId: z.string(),
  sentenceId: z.string(),
});