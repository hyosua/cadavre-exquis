// ghost-words.data.ts

// Banque de mots de secours classés par type de phase
export const GHOST_WORDS_DB: Record<string, string[]> = {
  // --- BASIQUES ---
  s: [ // Sujets
    "Le pape", "Un grille-pain", "L'ornithorynque", "Un influenceur", 
    "Mon clone", "Le voisin louche", "Un zombie", "Le stagiaire",
    "Batman", "Une endive", "Le serveur", "Ton futur Toi",
    "Un spéléologue", "L'archonte", "Une chèvre", "Un pingouin",
    "Un bouquiniste", "La déesse des nouilles", "Une chanteuse d'opéra", "Un frelon géant",
    "La chaise vide", "Un vagabond", "Le vide intersidéral", "Ton ami imaginaire",
    "Un samouraï", "Le taureau du voisin", "Une momie"
  ],

  adj: [ // Adjectifs (Généralement masculin singulier pour "fitter" avec le plus de cas)
    "radioactif", "mélancolique", "visqueux", "invisible", 
    "suspect", "pétillant", "dépressif", "héroïque", 
    "mou", "croustillant", "magnifique", "hurlant",
    "bizarre", "saugrenu", "flou",
    "enthousiaste", "fou à lier",
    "indécis", "instable", "mesquin"
  ],

  v: [ // Verbes Transitifs (3ème pers. singulier)
    "dévore", "analyse", "chatouille", "désintègre", 
    "hypnotise", "négocie avec", "regarde", "cuisine", 
    "insulte", "adore", "punit", "scanne",
    "obsède", "attaque", "embellit", "lance par la fenêtre",
    "encourage", "hurle après", "sent venir", "repousse",
    "ordonne", "supplie", "examine", "invoque", "hante"
  ],

  cod: [ // Compléments d'Objet Direct
    "sa propre tête", "la théorie de la relativité", "une chaussette sale", 
    "le vide intersidéral", "un kebab", "la reine d'Angleterre", 
    "tes espoirs", "un parpaing", "le code source", "une licorne",
    "la quintessence du ridicule", "un ermite du Tibet", "un vieux jouet", "un homme hanté par le nombre 13",
    "la lune", "la poussière du temps", "le reflet d'un regard", "la clef mystérieuse",
    "le début d'une chanson", "l'ombre d'un pigeon", "la Vérité", "la foule en délire",
    "le destin de l'humanité", "le secret de la vie", "un fantôme", "un dragon en plastique"
  ],

  cc: [ // Compléments Circonstanciels (Mixte)
    "avec une cuillère", "sur la lune", "pendant la messe", 
    "très violemment", "sans pantalon", "dans le métavers", 
    "hier soir", "avec passion", "sous la douche",
    "en catimini", "malgré la tempête", "sur le pont du Titanic", "contre toute expectative",
    "à la lueur chancelante", "devant un coucher de soleil", "malgré l'approbation de la foule", "dans un élan de colère",
    "dans un élan de bravoure", "au milieu du chaos", "entre deux instants", "avec un sourire narquois",
    "au milieu d'un champ", "comme ça vient", "sur un coup de tête"
  ],
  
  coi: [ // Complément d'Objet Indirect
    "à son chat", "au président", "contre un mur", "pour la gloire", 
    "à des inconnus", "au percepteur des impôts", "à son ex",
    "à tout le monde", "au néant", "à une amie", "pour une broutille",
    "contre la faim", "à l'ambiance générale", "avec prudence", "en perte",
    "à l'assemblée", "au conseiller de la Maison Blanche", "pour un avantage", "de paroles veines",
    "de sa propre initiative", "à la panique générale"
  ],

  atts: [ // Attribut du sujet
    "un génie incompris", "complètement fou", "en mousse", 
    "le maître du monde", "perdu", "une illusion", "toxique",
    "confus", "une rengaine", "très lâche", "désenchanté",
    "déçu", "une joie forcée", "obsolète", "moqueur",
    "de mauvaise humeur", "étrange", "l'ennui total", "sans espoir",
    "quelque chose de mystérieux", "un succès", "le comble du ridicule"
  ],

  pp: [ // Proposition Principale
    "La mouche tousse", "Le robot s'éveille", "Tout explose", 
    "Il ne se passe rien", "La prophétie se réalise",
    "Le paradigme s'effondre", "Le chat contemple le vide", "L'apoplexie menace", "Le séisme intérieur gronde",
    "L'horloge s'est figée", "Le hasard s'en mêle", "Le calme hurle", "Le temps s'effrite",
    "Le souvenir fait mail", "La vérité se révèle", "Le chaos s'installe", "L'équilibre se brise",
    "La fracture s'ouvre", "La paix trompe", "L'absurde' triomphe"
  ],

  sub: [ // Proposition Subordonnée
    "parce qu'il a faim", "quand les poules auront des dents", 
    "si personne ne regarde", "bien qu'il soit midi", 
    "avant de mourir",
    "quoique l'on en dise", "dès que la colline refleurira", "si le dicton dit vrai", "parce que l'ennui le ronge",
    "pour que la solitude prenne fin", "malgré qu'il soit fort tard", "à moins que le destin en décide autrement", "quand le sommet sera atteint",
    "si l’on y réfléchit bien", "malgré le mépris des autres", "puisque le sens n’est pas clair", "même si la négligence saute aux yeux",
    "afin de conjurer le maléfice", "selon la croyance", "dès que le soleil se lèvera"
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
    "au cœur de l’hiver", "à l’époque des lumières", "pendant la quinzième lune", "depuis l'aube des temps",
    "avant l'apogée", "pendant la traversée", "à l'instant fatidique", "au lever du jour",
    "il y a une éternité", "quand la journée s’achève", "au moment de la péremption", "dans le creux du temps",
    "jusqu'à l'extinction des feux", "à l'heure du dilemme", "au premier chant du coq"
  ],

  ccm: [ // Manière
    "avec élégance", "comme un bourrin", "en silence", 
    "sournoisement", "à cloche-pied", "les yeux fermés",
    "avec désinvolture", "en peu de mots", "de façon saccadée", "avec l'aplomb d'un expert",
    "selon un rite ancestral", "avec une exagération grotesque", "en ne disant pas tout", "en généralisant",
    "à la tombée de la nuit", "avec la nonchalance d'un bouledogue", "par mimétisme troublant", "avec humilité",
    "en cachant son jeu", "en parlant sans fin", "par une évidence"
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
    "L’incroyable voisin", "Un cochon fatigué", "Un cormoran aveugle", "Un corbeau futé",
    "Un marin solitaire", "Un ministre hongrois", "Le gardien de nuit du Louvre", "Le Croque Mitaine",
    "Le fantôme de Marie Antoinette", "Le petit chaperon rouge", "Le chat botté", "Skywalker",
    "Bilbo le Hobbit", "Robin des bois", "Le président des États-Unis"
  ],

  adv: [ // Adverbe
    "soudainement", "bizarrement", "peut-être", 
    "toujours", "rarement", "intensément",
    "doucement", "impunément", "placidement", "insidieusement",
    "inlassablement", "correctement", "démoniaquement", "à tort",
    "à raison", "furtivement", "pour toujours", "vaguement",
    "à la va-vite", "lentement", "à tort ou à raison"
  ]
};

// Fallback générique si la clé n'existe pas
const GENERIC_FALLBACKS = [
  "truc", "bidule", "machin", "chose", "artéfact", "trucmuche", 
  "ustensile", "embrouille", "gribouillis", "patacaisse", 
  "zézette", "soubresaut", "objet", "moment", "mystère", 
  "charabia", "fouillis", "micmac"
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