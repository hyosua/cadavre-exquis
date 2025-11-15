import { GoogleGenerativeAI } from "@google/generative-ai";
import { Game } from "@/types/game.types"; 

// Initialiser l'API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Fonction pour générer la phrase de l'IA
export async function getAIMove(game: Game): Promise<string> {
  
  // Extraire les infos nécessaires de l'objet Game
  const currentPhaseIndex = game.currentPhase;
  const currentPhaseDetails = game.config.phaseDetails[currentPhaseIndex];
  const currentPhaseType = currentPhaseDetails.titre;
  const helperText = currentPhaseDetails.helper;

  // Le "prompt" est l'étape la plus importante
  const prompt = `
    Tu es un joueur dans une partie de "cadavre exquis".
    Le jeu est un jeu littéraire où chaque joueur écrit un morceau de phrase à tour de rôle.
    
    Ta tâche actuelle est d'écrire la partie de la phrase qui correspond à : "${currentPhaseType}"

    Instructions :
    1. Génère un morceau de phrase qui respecte le type donné.
    2. Ta réponse DOIT être courte et ne contenir QUE le morceau de phrase que tu ajoutes.
    3. N'ajoute pas de guillemets autour de ta réponse.
    4. Le texte d'aide pour cette phase est : "${helperText}"

    Écris maintenant ta partie pour "${currentPhaseType}" :
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();
    
    // Nettoyage simple pour s'assurer que Gemini n'ajoute pas de guillemets
    text = text.replace(/^"|"$/g, ''); 

    // Réponse de repli simple si l'IA ne renvoie rien
    if (!text) {
      return `un ${currentPhaseType} étrange`;
    }

    return text;
  } catch (error) {
    console.error("Erreur de l'API Gemini:", error);
    // Fournir une réponse de repli en cas d'échec de l'API
    return `un ${currentPhaseType} mystérieux`;
  }
}