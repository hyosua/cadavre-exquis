// config.ts
'use client'

import type { GameConfig, phaseDetail } from "@/types/game.type"

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
}

export const PHASE_DETAILS: Record<string, phaseDetail> = {
  s: {
    titre: "Sujet",
    helper: "Qui? Quoi?",
    placeholder: "Le chat, un magicien, Ma voisine..."
  },

  adj: {
    titre: "Adjectif",
    helper: "Comment est-il/elle?",
    placeholder: "Rouge, rapide, magnifique..."
  },
  
  v: {
    titre: "Verbe Transitif",
    helper: "Ton verbe agit sur Quoi/Qui?",
    placeholder: "Mange, regarde, aime..."
  },
  
  cod: {
    titre: "C.O.D",
    helper: "L'action est faîte sur Quoi/Qui?",
    placeholder: "Une tarte, un secret, le président..."
  },

  cc: {
    titre: "Comp. Circonstanciel",
    helper: "Où? Quand? Comment?",
    placeholder: "Dans le jardin, hier soir, rapidement..."
  },
  coi: {
    titre: "C.O.I",
    helper: "À qui? Pour qui? À quoi?",
    placeholder: "À son ami, pour le roi, au chien..."
  },

  atts: {
    titre: "Attribut du sujet",
    helper: "Qu'est-il/elle? Comment est-il/elle?",
    placeholder: "Heureux, triste, en colère, médecin..."
  },

  pp: {
    titre: "Proposition principale",
    helper: "Idée principale de la phrase",
    placeholder: "Il part en voyage, elle chante sous la pluie..."
  },

  sub: {
    titre: "Proposition subordonnée",
    helper: "Complète la principale",
    placeholder: "Quand il pleut, parce qu’elle a peur..."
  },

  ccl: {
    titre: "Complément de lieu",
    helper: "Où?",
    placeholder: "Dans le jardin, sur la montagne, à Paris..."
  },

  cct: {
    titre: "Complément de temps",
    helper: "Quand?",
    placeholder: "Hier, à midi, en été..."
  },

  ccm: {
    titre: "Complément de manière",
    helper: "Comment?",
    placeholder: "Rapidement, avec soin, en silence..."
  },

  ve: {
    titre: "Verbe d’état",
    helper: "Relie le sujet à son état ou qualité",
    placeholder: "Être, sembler, devenir, paraître..."
  },

  gns: {
    titre: "Groupe nominal sujet",
    helper: "Sujet complet avec ses expansions",
    placeholder: "Le grand magicien aux yeux dorés..."
  },

  adv: {
    titre: "Adverbe",
    helper: "Comment ? Quand ? Où ? Combien ?",
    placeholder: "Rapidement, souvent, ici, très, bien..."
  }
}

/**
 * Définition de ce qu'est un "Preset" (une structure de phrase).
 * C'est une "recette" qui utilise les "briques" ci-dessus.
 */
export interface GamePreset {
  id: string; 
  name: string; // Le nom affiché à l'utilisateur
  example: string; // L'exemple pour l'UI
  difficulty: 'facile' | 'moyen' | 'difficile';
  phases: string[]; // La liste des briques (ex: ['s', 'v', 'cod'])
}

/**
 * La liste des presets
 * que le formulaire va importer et afficher.
 */
export const GAME_PRESETS: GamePreset[] = [
  {
    id: 'action_directe',
    name: 'Sujet + Verbe + COD',
    example: 'Le dragon crache du feu.',
    difficulty: 'facile',
    phases: ['s', 'v', 'cod'],
  },
  {
    id: 'mouvement',
    name: 'Sujet + Verbe d\'État + CC',
    example: 'Le pirate chante sur le bateau.',
    difficulty: 'facile',
    phases: ['s', 've', 'cc'],
  },
  {
    id: 'etendue',
    name: 'Sujet + Verbe + COD + CC',
    example: 'La princesse lance une fleur dans le vent.',
    difficulty: 'moyen',
    phases: ['s', 'v', 'cod', 'cc'],
  },
  {
    id: 'type_adj',
    name: 'Sujet + Adj + Verbe + COD',
    example: 'Le petit chat malicieux dévore une souris.',
    difficulty: 'moyen',
    phases: ['s', 'adj', 'v', 'cod'],
  },
  {
    id: 'moyen_cod_cc',
    name: 'Sujet + Adj + Verbe + COD + CC',
    example: 'Le petit chat malicieux dévore une souris un soir de pleine lune.',
    difficulty: 'moyen',
    phases: ['s', 'adj', 'v', 'cod', 'cc'],
  },
  {
  id: 'subordonnee',
  name: 'PP + SUB',
  example: 'J’espère que tu comprendras mes mots',
  difficulty: 'difficile',
  phases: ['pp', 'sub'],
  },
  {
  id: 'scene_complete',
  name: 'CCL + GNS + V + Adv + COD + Adj',
  example: 'Sur la plage déserte, les enfants du village, construisent soigneusement des châteaux immenses.',
  difficulty: 'difficile',
  phases: ['ccl', 'gns','v','adv','cod','adj'],
  },


  {
    id: 'custom',
    name: '🧑‍🔬 Personnalisé',
    example: 'Composez vous-même votre structure.',
    difficulty: 'difficile',
    phases: [], // Vide, car l'utilisateur choisira
  },
];