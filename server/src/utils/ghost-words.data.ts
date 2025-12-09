// ghost-words.data.ts

// Banque de mots de secours classés par type de phase
export const GHOST_WORDS_DB: Record<string, string[]> = {
  // --- BASIQUES ---
  s: [ // Sujets
    "Le pape", "Un grille-pain", "L'ornithorynque", "Un influenceur", 
    "Mon clone", "Le voisin louche", "Un zombie philosophe", "Le stagiaire",
    "Batman", "Une endive", "Le serveur", "Ton futur toi",
    "Un spéléologue", "L'archonte", "La chèvre cosmique", "Le manchot empereur",
    "Un bouquiniste taciturne", "La déesse des nouilles", "Un sémaphore désaffecté", "Le méandre oublié",
    "Le cénobite", "Une phlébite récurrente", "Le mime intersidéral", "Le glouton sibérien",
    "Un hédoniste contrit", "Le spectre d'un clavecin", "La chimère éphémère"
  ],

  adj: [ // Adjectifs (Généralement masculin singulier pour "fitter" avec le plus de cas)
    "radioactif", "mélancolique", "visqueux", "invisible", 
    "suspect", "pétillant", "dépressif", "héroïque", 
    "mou", "croustillant", "magnifique", "hurlant",
    "ubiquitaire", "saugrenu", "nébuleux",
    "dithyrambique", "soporifique",
    "aboulique", "versatile", "fallacieux"
  ],

  v: [ // Verbes Transitifs (3ème pers. singulier)
    "dévore", "analyse", "chatouille", "désintègre", 
    "hypnotise", "négocie avec", "regarde", "cuisine", 
    "insulte", "adore", "punit", "scanne",
    "obnubile", "vilipende", "transfigure", "défenestre",
    "exhorte", "collige", "vocifère contre", "subodore",
    "procrastine sur", "décrète", "sublime", "invoque", "disséque"
  ],

  cod: [ // Compléments d'Objet Direct
    "sa propre tête", "la théorie de la relativité", "une chaussette sale", 
    "le vide intersidéral", "un kebab", "la reine d'Angleterre", 
    "tes espoirs", "un parpaing", "le code source", "une licorne",
    "la quintessence du ridicule", "un solipsisme aigre", "le syndrome de Stendhal", "la notion d'entropie",
    "un phénakistiscope", "la triskaïdékaphobie", "une sébile en orichalque", "les arcanes majeurs",
    "un zénith précaire", "l'obsolescence programmée", "les éphélides de l'âme", "une drosophile mutante",
    "le panégyrique", "un octroi désuet", "le murmure des abysses"
  ],

  cc: [ // Compléments Circonstanciels (Mixte)
    "avec une cuillère", "sur la lune", "pendant la messe", 
    "très violemment", "sans pantalon", "dans le métavers", 
    "hier soir", "avec passion", "sous la douche",
    "en catimini", "nonobstant les foudres", "à l'instar d'un derviche", "contre toute expectative",
    "à la lueur chancelante", "par le truchement d'un corbeau", "en dépit de la bienséance", "dans un élan d'acrimonie",
    "sous l'égide d'un gnome", "au gré des limbes", "dans un interstice spatio-temporel", "avec une emphase baroque",
    "au sein du tohu-bohu", "selon l'herméneutique", "à la va-comme-je-te-pousse"
  ],

  // --- AVANCÉS (Tes autres clés) ---
  
  coi: [ // Complément d'Objet Indirect
    "à son chat", "au président", "contre un mur", "pour la gloire", 
    "à des inconnus", "au percepteur des impôts", "à son ex",
    "à la postérité", "de l'inanité", "à une égérie évanescente", "pour une peccadille",
    "contre l'inanition", "à la nébulosité ambiante", "avec circonspection", "en déshérence",
    "à la conjuration", "à l'éminence grise", "pour une prébende", "du verbiage éculé",
    "au flegme britannique", "de son propre chef", "à la syncope collective"
  ],

  atts: [ // Attribut du sujet
    "un génie incompris", "complètement fou", "en mousse", 
    "le maître du monde", "perdu", "une illusion", "toxique",
    "amphigourique", "une antienne lancinante", "l'épitomé de la veulerie", "désenchanté",
    "un simulacre probant", "la béatitude forcée", "obsolète", "un quolibet",
    "parfaitement atrabilaire", "une idiosyncrasie", "le paroxysme de l'ennui", "irrévocable",
    "l'artefact cryptique", "un égrégore", "sui generis"
  ],

  pp: [ // Proposition Principale
    "La mouche tousse", "Le robot s'éveille", "Tout explose", 
    "Il ne se passe rien", "La prophétie se réalise",
    "Le paradigme s'effondre", "Le chat contemple le vide", "L'apoplexie menace", "Le séisme intérieur gronde",
    "L'horloge s'est figée", "La synchronicité opère", "Le silence est assourdissant", "Le temps se délite",
    "L'anamnèse est douloureuse", "La sémantique est trahie", "Le chaos s'installe", "La stase est rompue",
    "Le schisme s'élargit", "La plénitude est feinte", "Le non-sens triomphe"
  ],

  sub: [ // Proposition Subordonnée
    "parce qu'il a faim", "quand les poules auront des dents", 
    "si personne ne regarde", "bien qu'il soit midi", 
    "avant de mourir",
    "quoique l'on en dise", "dès que l'ubac reverdira", "si l'adage se confirme", "parce que l'ennui le ronge",
    "afin que la déréliction cesse", "malgré qu'il soit fort tard", "à moins que le sort n'en décide autrement", "lorsque l'acmé sera atteinte",
    "si l'on considère l'axiome", "nonobstant le dédain général", "puisque l'exégèse est ambiguë", "bien que l'incurie soit manifeste",
    "afin de conjurer le maléfice", "selon la doxologie", "dès que l'astre s'obscurcira"
  ],

  ccl: [ // Lieu
    "dans un congélateur", "sur Mars", "au fond du jardin", 
    "dans la matrice ", "sous le lit", "devant l'entrée d'une épicerie'",
    "dans un couvent ésotérique", "près de l'église du village", "sous un platane centenaire", "dans le dédale d'un supermarché",
    "au sein d'une cathédrale", "derrière l'auberge de jeunesse", "dans une crypte désaffectée", "vers le centre-ville",
    "au pied du mont blanc", "dans une fissure spatio-temporelle", "à l'orée du bois spectral", "sur le linteau de la porte",
    "au beau milieu d'un lac", "dans l'antichambre", "le long du péristyle"
  ],

  cct: [ // Temps
    "l'année prochaine", "il y a mille ans", "à minuit pile", 
    "dans un univers parallèle", "tout de suite", "au crépuscule",
    "lors du solstisce hiémal", "au temps de l'héliocentrisme", "pendant la quinzième lune", "depuis l'aube des temps",
    "avant l'apogée", "durant la psychopompe", "à l'instant fatidique", "dès potron-minet",
    "il y a une éternité", "quand l'éphéméride s'épuise", "au moment de la péremption", "pendant l'interrègne",
    "jusqu'à l'extinction du dernier feu", "à l'heure du dilemme", "au premier chant du coq"
  ],

  ccm: [ // Manière
    "avec élégance", "comme un bourrin", "en silence", 
    "sournoisement", "à cloche-pied", "les yeux fermés",
    "avec désinvolture", "d'une manière laconique", "par syncope", "avec l'aplomb d'un expert",
    "selon un rite ancestral", "avec une ostentation grotesque", "en usant de paralipses", "par antonomase",
    "à la faveur de la nuit", "avec la nonchalance d'un bouledogue", "par mimétisme troublant", "sans la moindre morgue",
    "en toute duplicité", "avec une faconde démesurée", "par le biais d'un truisme"
  ],

  ve: [ // Verbe d'état
    "semble", "devient", "paraît", "reste", 
    "a l'air", "demeure", "se sent",
    "éclot en", "s'avère", "est considéré comme", "finit par être",
    "se meut en", "se trouve", "is perçu comme", "se profile en",
    "incarne", "se révèle", "se perpétue en", "ressemble à",
    "dégénère en", "évoque", "se mue en"
  ],

  gns: [ // Groupe Nominal Sujet (plus complexe)
    "Le grand monstre vert", "La petite souris masquée", 
    "Le dernier survivant", "L'incroyable Hulk",
    "Le dilettante patenté", "La scorie cosmique", "Le cormoran aveugle", "L'égrégore néfaste",
    "L'injonction paradoxale", "Le boucanier albinos", "La chimère balkanique", "Le parangon de vertu",
    "L'énigme insoluble", "Le fardeau de Sisyphe", "La mélopée oubliée", "Le spectre d'un amphithéâtre",
    "La sérendipité forcée", "Le phénix moribond", "L'apocryphe sibyllin"
  ],

  adv: [ // Adverbe
    "soudainement", "bizarrement", "peut-être", 
    "toujours", "rarement", "intensément",
    "doucement", "impunément", "placidement", "insidieusement",
    "inlassablement", "congrument", "démoniaquement", "apocryphes",
    "irrévocablement", "furtivement", "ostensiblement", "évasivement",
    "négligemment", "furtivement", "languissamment"
  ]
};

// Fallback générique si la clé n'existe pas
const GENERIC_FALLBACKS = [
  "truc", "bidule", "machin", "chose", "artéfact", "galimatias", 
  "ustensile", "pantographe", "gribouillis", "patacaisse", 
  "zézette", "soubresaut", "ergot", "zénith", "méandre", 
  "pérégrination", "nébulosité", "affabulation", "péripétie", "logogriphe"
];

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