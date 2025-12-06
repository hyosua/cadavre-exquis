// ghost-words.data.ts

// Banque de mots de secours classés par type de phase
export const GHOST_WORDS_DB: Record<string, string[]> = {
  // --- BASIQUES ---
  s: [ // Sujets
    "Le pape", "Un grille-pain", "L'ornithorynque", "Un influenceur", 
    "Mon clone", "Le voisin louche", "Un zombie philosophe", "Le stagiaire",
    "Batman", "Une endive", "Le serveur", "Ton futur toi"
  ],

  adj: [ // Adjectifs (Généralement masculin singulier pour "fitter" avec le plus de cas)
    "radioactif", "mélancolique", "visqueux", "invisible", 
    "suspect", "pétillant", "dépressif", "héroïque", 
    "mou", "croustillant", "magnifique", "hurlant"
  ],

  v: [ // Verbes Transitifs (3ème pers. singulier)
    "dévore", "analyse", "chatouille", "désintègre", 
    "hypnotise", "négocie avec", "regarde", "cuisine", 
    "insulte", "adore", "punit", "scanne"
  ],

  cod: [ // Compléments d'Objet Direct
    "sa propre tête", "la théorie de la relativité", "une chaussette sale", 
    "le vide intersidéral", "un kebab", "la reine d'Angleterre", 
    "tes espoirs", "un parpaing", "le code source", "une licorne"
  ],

  cc: [ // Compléments Circonstanciels (Mixte)
    "avec une cuillère", "sur la lune", "pendant la messe", 
    "très violemment", "sans pantalon", "dans le métavers", 
    "hier soir", "avec passion", "sous la douche"
  ],

  // --- AVANCÉS (Tes autres clés) ---
  
  coi: [ // Complément d'Objet Indirect
    "à son chat", "au président", "contre un mur", "pour la gloire", 
    "à des inconnus", "au percepteur des impôts", "à son ex"
  ],

  atts: [ // Attribut du sujet
    "un génie incompris", "complètement fou", "en mousse", 
    "le maître du monde", "perdu", "une illusion", "toxique"
  ],

  pp: [ // Proposition Principale
    "La mouche tousse", "Le robot s'éveille", "Tout explose", 
    "Il ne se passe rien", "La prophétie se réalise"
  ],

  sub: [ // Proposition Subordonnée
    "parce qu'il a faim", "quand les poules auront des dents", 
    "si personne ne regarde", "bien qu'il soit midi", 
    "avant de mourir"
  ],

  ccl: [ // Lieu
    "dans ton frigo", "sur Mars", "au fond du jardin", 
    "dans la matrice", "sous le lit", "à Pôle Emploi"
  ],

  cct: [ // Temps
    "l'année prochaine", "il y a mille ans", "à minuit pile", 
    "jamais", "tout de suite", "au crépuscule"
  ],

  ccm: [ // Manière
    "avec élégance", "comme un bourrin", "en silence", 
    "sournoisement", "à cloche-pied", "les yeux fermés"
  ],

  ve: [ // Verbe d'état
    "semble", "devient", "paraît", "reste", 
    "a l'air", "demeure", "se sent"
  ],

  gns: [ // Groupe Nominal Sujet (plus complexe)
    "Le grand monstre vert", "La petite souris masquée", 
    "Le dernier survivant", "L'incroyable Hulk"
  ],

  adv: [ // Adverbe
    "soudainement", "bizarrement", "peut-être", 
    "toujours", "rarement", "intensément"
  ]
};

// Fallback générique si la clé n'existe pas
const GENERIC_FALLBACKS = ["truc", "bidule", "machin", "chose"];

/**
 * Récupère un mot aléatoire selon la phase grammaticale en cours.
 * @param phaseKey La clé de la phase (ex: 's', 'cod', 'adj')
 */
export function getGhostWord(phaseKey: string): string {
  const wordList = GHOST_WORDS_DB[phaseKey];
  
  if (!wordList || wordList.length === 0) {
    // Sécurité si la phase n'est pas trouvée
    console.warn(`[GhostWord] Aucune liste trouvée pour la phase: ${phaseKey}`);
    return GENERIC_FALLBACKS[Math.floor(Math.random() * GENERIC_FALLBACKS.length)];
  }

  return wordList[Math.floor(Math.random() * wordList.length)];
}