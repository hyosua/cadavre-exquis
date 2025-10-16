import { z } from 'zod';

export const createGameSchema = z.object({
  pseudo: z.string().min(2).max(20),
  config: z.object({
    phases: z.array(z.string()).min(4).max(6),
    timePerPhase: z.number().min(30).max(300),
  }),
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