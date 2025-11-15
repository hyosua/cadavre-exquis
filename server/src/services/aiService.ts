import { GoogleGenerativeAI } from "@google/generative-ai";
import { Game } from "@/types/game.types"; 

// Initialiser l'API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Fonction pour générer la phrase de l'IA
export async function getAIMove(game: Game): Promise<string> {
  
  // Extraire les infos nécessaires de l'objet Game
  const currentPhaseIndex = game.currentPhase;
  console.log("Current phase index:", currentPhaseIndex);
  const currentPhaseTypeKey = game.config.phases[currentPhaseIndex];
  const currentPhaseDetails = game.config.phaseDetails[currentPhaseTypeKey];
  console.log("Current phase details:", currentPhaseDetails);
  const currentPhaseType = currentPhaseDetails.titre;
  console.log("Current phase type:", currentPhaseType);
  const helperText = currentPhaseDetails.helper;

  // Générer des contraintes aléatoires pour forcer la variété
  const styles = ['drôle', 'poétique', 'absurde', 'mystérieux', 'quotidien', 'épique'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  
  const themes = ['nature', 'cuisine', 'technologie', 'animaux', 'espace', 'histoire'];
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];

  // Le "prompt" est l'étape la plus importante
  const prompt = `
    Tu es un joueur dans une partie de "cadavre exquis".
    
    Ta tâche : écrire un(e) "${currentPhaseType}"
    Aide : ${helperText}
    
    Contraintes créatives pour cette fois :
    - Style : ${randomStyle}
    - Thème suggéré : ${randomTheme}
    
    Sois original ! Ne répète jamais les mêmes idées.
    Réponds UNIQUEMENT avec le ${currentPhaseType}, sans guillemets ni explication.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();
    
    // Nettoyage simple pour s'assurer que Gemini n'ajoute pas de guillemets ou ponctuation
    text = text.replace(/^["']|["']$/g, '');
    text = text.replace(/[.!?]$/g, '');
    text = text.trim(); 

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