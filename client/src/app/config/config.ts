// config.ts
'use client'

import type { GameConfig } from "@/types/game.type"

export const DEFAULT_CONFIG: GameConfig = {
    phases : ['s','adj','v','cod','cc'],

    phaseDetails: {
      s: {
        titre: "Sujet",
        helper: "Qui? Quoi?",
        placeholder: "Le chat, un magicien, Ma voisine..."
      },
    
      adj: {
        titre: "Adjectif",
        helper: "Comment est-il/elle?",
        placeholder: "Rouge, rapide, bizarre, magnifique..."
      },
      
      v: {
        titre: "Verbe Transitif",
        helper: "Ton verbe agit sur Quoi/Qui?",
        placeholder: "Mange, regarde, cherche, aime..."
      },
      
      cod: {
        titre: "C.O.D",
        helper: "L'action est faîte sur Quoi/Qui?",
        placeholder: "Une tarte, un secret, le président..."
      },
    
      cc: {
        titre: "Complément",
        helper: "Où? Quand? Comment?",
        placeholder: "Dans le jardin, hier soir, rapidement..."
      },
    
    },
    timePerPhase: 60
} as const