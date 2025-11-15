import { GoogleGenerativeAI } from "@google/generative-ai";
import { Game, AIPlayer } from "@/types/game.types"; 

// Initialiser l'API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

function isAIPlayer(player: any): player is AIPlayer {
  return player.isAi === true;
}

// Fonction pour générer la phrase de l'IA
export async function getAIMove(game: Game, aiPlayerId: string): Promise<string> {
  
  // Extraire les infos nécessaires de l'objet Game
  const currentPhaseIndex = game.currentPhase;
  console.log("Current phase index:", currentPhaseIndex);
  const currentPhaseTypeKey = game.config.phases[currentPhaseIndex];
  const currentPhaseDetails = game.config.phaseDetails[currentPhaseTypeKey];
  console.log("Current phase details:", currentPhaseDetails);
  const currentPhaseType = currentPhaseDetails.titre;
  console.log("Current phase type:", currentPhaseType);
  const helperText = currentPhaseDetails.helper;

  // Récuperer la créativité du joueur IA
  const aiPlayer = game.players.find(p => p.id  === aiPlayerId)

  // verif explicite pour que Typescript comprenne le type
  if (!aiPlayer || !isAIPlayer(aiPlayer)) {
    return `un ${currentPhaseType} étrange`;
  }

  const aiCreativity = aiPlayer?.creativity || "strict"

  const creativitySettings = {
    strict: { temperature: 0.7, topK: 20, topP: 0.8},
    equilibre: { temperature: 1.0, topK: 30, topP: 0.9},
    creatif: { temperature: 1.3, topK: 40, topP: 0.95}
  }

  const settings = creativitySettings[aiCreativity]

  const systemInstruction = `
    Tu es un joueur dans une partie de "cadavre exquis".
    Tu ne dois JAMAIS répéter les mêmes idées.
    Tu dois répondre UNIQUEMENT avec le(la) "${currentPhaseType}" demandé(e).
    Ta réponse doit être brute, sans guillemets, sans majuscule au début, et sans ponctuation finale ni explication.
  `;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemInstruction  
  })
  // Générer des contraintes aléatoires pour forcer la variété
  const styles = ['drôle', 'poétique', 'absurde', 'mystérieux', 'quotidien', 'épique'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  
  const themes = ['nature', 'cuisine', 'technologie', 'animaux', 'espace', 'histoire'];
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];

  // Le "prompt" est l'étape la plus importante
  const prompt = `
    Ta tâche : écrire un(e) "${currentPhaseType}"
    Voici, si besoin une aide pour cette phase : ${helperText}
    
    Contraintes créatives pour cette fois :
    - Style : ${randomStyle}
    - Thème suggéré : ${randomTheme}
  `;

  try {
    const result = await model.generateContent({
      contents: [{role: "user", parts: [{text: prompt}] }],
      generationConfig: {
        temperature: settings.temperature,
        topK: settings.topK,
        topP: settings.topP,
      }});
    const response = result.response;
    console.log("Réponse brute de Gemini:", response);
    let text = response.text().trim();
    console.log("Texte extrait de la réponse:", text);
    
    // Nettoyage simple pour s'assurer que Gemini n'ajoute pas de guillemets ou ponctuation
    text = text.replace(/^["']|["']$/g, '');
    text = text.replace(/[.!?]$/g, '');
    text = text.trim(); 

    // Réponse de repli simple si l'IA ne renvoie rien
    if (!text) {
      return `un ${currentPhaseType} étrange`;
    }

    console.log(`🤖 AI (${aiCreativity}): "${text}"`);

    return text;
  } catch (error) {
    console.error("Erreur de l'API Gemini:", error);
    // Fournir une réponse de repli en cas d'échec de l'API
    return `un ${currentPhaseType} mystérieux`;
  }
}