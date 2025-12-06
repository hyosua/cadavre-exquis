import { getGhostWord } from "@/utils/ghost-words.data";
import { Game, AIPlayer } from "../types/game.types";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialiser l'API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

function isAIPlayer(player: any): player is AIPlayer {
  return player.isAi === true;
}

// Fonction pour générer la phrase de l'IA
export async function getAIMove(game: Game, aiPlayerId: string): Promise<string> {
  
  // Extraire les infos nécessaires de l'objet Game
  const currentPhaseIndex = game.currentPhase;
  const currentPhaseTypeKey = game.config.phases[currentPhaseIndex];
  const currentPhaseDetails = game.config.phaseDetails[currentPhaseTypeKey];
  const currentPhaseType = currentPhaseDetails.titre;
  // const helperText = currentPhaseDetails.helper;

  // Mapping local pour la concision (ou importé)
  const constraints: Record<string, string> = {
    s: "Groupe Nominal (Art. + Nom). Pas d'adjectif.",
    adj: "Adjectif seul.",
    v: "Verbe conjugué seul.",
    cod: "Groupe Nominal objet. Pas de verbe.",
    cc: "Complément (Lieu/Temps). Pas de verbe.",
    // fallback générique
    default: "Un seul segment de phrase court."
  };

  const grammaticalRule = constraints[currentPhaseTypeKey] || constraints.default;

  // Récuperer la créativité du joueur IA
  const aiPlayer = game.players.find(p => p.id  === aiPlayerId)

  // verif explicite pour que Typescript comprenne le type
  if (!aiPlayer || !isAIPlayer(aiPlayer)) {
    console.warn(`[AI] Joueur ${aiPlayerId} invalide. Utilisation GhostWord.`);
    return getGhostWord(currentPhaseTypeKey);
  }

  const aiPersonnality = aiPlayer?.personnality || "comique"

  let systemInstruction = "";

  switch (aiPersonnality) {
    case "scientifique":
      systemInstruction = "Tu es un scientifique. Tes réponses doivent correspondre à l'univers de la science";
      break;
    case "comique":
      systemInstruction = "Tes réponses doivent être absurdes, drôles, inattendues.";
      break;
    case "grognon":
      systemInstruction = "Tes réponses doivent être tristes, mélancoliques ou dramatiques";
      break;
    case "pirate":
      systemInstruction = "Tu dois lier ta réponse à l'univers des pirates.";
      break;
    case "romantique":
      systemInstruction = "Tu es un poète romantique. Tes réponses doivent être belles et imagées";
      break;
  }


  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemInstruction  
  })

  // 2. Construire un prompt court
  const promptParts = [
    `Tu dois fournir un mot ou groupe de mots conforme à la règle donnée.`,
    `Règle GRAMMATICALE: ${currentPhaseDetails.titre}`,
    `RÈGLE STRICTE: ${grammaticalRule}`,
    `FORMAT: Pas d'explications.`,
  ];

    // if (helperText) {
    //   promptParts.push(`Aide: ${helperText}`);
    // }

  if (currentPhaseType.toLowerCase().includes('verbe')) {
    promptParts.push('Note: conjugue le verbe (3e pers. sing.)');
  }

  const prompt = promptParts.join('\n');

  try {
    const result = await model.generateContent({
      contents: [{role: "user", parts: [{text: prompt}] }],
      generationConfig: { temperature: 0.85, topK: 40, topP: 0.95}
    });
    const response = result.response;
    console.log("Réponse brute de Gemini:", response);
    let text = response.text().trim();
    
    // Nettoyage simple pour s'assurer que Gemini n'ajoute pas de guillemets ou ponctuation
    text = text.replace(/^["']|["']$/g, '');
    text = text.replace(/[.!?]$/g, '');
    text = text.trim().toLowerCase(); 

    // Réponse de repli simple si l'IA ne renvoie rien
    if (!text) {
      console.warn(`[AI] Réponse vide pour ${aiPersonnality}. Utilisation GhostWord.`);
      return getGhostWord(currentPhaseTypeKey);
    }

    console.log(`🤖 AI (${aiPersonnality}): "${text}"`);

    return text;
  } catch (error) {
    console.error("Erreur de l'API Gemini:", error);
    // Fournir une réponse de repli en cas d'échec de l'API
    console.log(`[AI] Fallback activé pour phase: ${currentPhaseTypeKey}`);
    return getGhostWord(currentPhaseTypeKey);
  }
}