import React from "react";
import { Player } from "@/types/game.type";
import { motion } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import { X, Crown, Hourglass } from "lucide-react"; // Ajout de Crown et Hourglass
import { Confirm } from "../ui/confirm";
import { Badge } from "@/components/ui/badge";
import { WritingLoader } from "./WritingLoader";

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
  showPlayedStatus?: boolean;
}

export function PlayerList({
  players,
  currentPlayerId,
  showPlayedStatus = false,
}: PlayerListProps) {
  const { kickPlayer, currentPlayer } = useGame();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      // CHANGEMENT ICI : Conteneur plus subtil, moins "lourd"
      className="bg-card/80 backdrop-blur-sm border shadow-sm rounded-xl p-4"
    >
      {/* En-tête avec un petit compteur stylisé */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Joueurs</h3>
        <Badge variant="secondary" className="text-xs font-normal">
          {players.length} en ligne
        </Badge>
      </div>

      <div className="space-y-2.5 font-sans">
        {players.map((player) => {
          const isMe = player.id === currentPlayerId;

          return (
            <motion.div
              layout // Ajoute une animation fluide si la liste change d'ordre
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                isMe
                  ? "bg-primary/10 border border-primary/20 shadow-sm" // Style pour le joueur courant : fond subtil coloré
                  : "bg-card hover:bg-accent/50 border border-border/40" // Style standard : fond neutre, hover léger
              }`}
            >
              {/* --- Partie Gauche : Statut + Pseudo + Badge --- */}
              <div className="flex items-center gap-3">
                {/* Indicateur en ligne/hors ligne avec pulsation */}
                <div className="relative flex h-2.5 w-2.5">
                  {player.isConnected && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      player.isConnected
                        ? "bg-green-500"
                        : "bg-muted-foreground/30"
                    }`}
                  ></span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className={`font-medium ${isMe ? "text-primary" : ""}`}>
                    {player.pseudo}
                    {isMe && " (Moi)"}
                  </span>

                  {/* CHANGEMENT ICI : Nouveau badge Hôte beaucoup plus propre */}
                  {player.isHost && (
                    <Badge
                      variant="outline"
                      className="w-fit gap-1 py-0.5 px-2 text-[10px] uppercase tracking-wider border-amber-500/40 text-amber-600 dark:text-amber-500 bg-amber-500/5"
                    >
                      <Crown size={10} className="mb-0.5" /> Hôte
                    </Badge>
                  )}
                </div>
              </div>

              {/* --- Partie Droite : Statut de jeu ou Bouton d'exclusion --- */}
              <div className="flex items-center gap-3 text-sm">
                {showPlayedStatus && (
                  <div className="flex justify-end min-w-[80px]">
                    {player.hasPlayedCurrentPhase ? (
                      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded-md text-xs">
                        a joué
                      </span>
                    ) : player.isThinking ? (
                      <WritingLoader />
                    ) : (
                      // Notre nouveau sablier animé
                      <motion.div
                        animate={{ rotate: [0, 180, 180, 360] }}
                        transition={{
                          duration: 4,
                          ease: "easeInOut",
                          times: [0, 0.1, 0.5, 0.6],
                          repeat: Infinity,
                        }}
                        className="text-muted-foreground/70 inline-block origin-center"
                        title="En attente..."
                      >
                        <Hourglass size={18} />
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Bouton Kick séparé par une petite ligne verticale si le statut est affiché */}
                {currentPlayer?.isHost && currentPlayerId !== player.id && (
                  <>
                    {showPlayedStatus && (
                      <div className="h-4 w-px bg-border/50"></div>
                    )}
                    <Confirm
                      variant="ghost" // Changé en ghost pour être moins agressif visuellement
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      buttonName={<X size={16} />}
                      message={`Voulez-vous vraiment exclure ${player.pseudo} de la partie ?`}
                      onConfirm={() => kickPlayer(player)}
                    />
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
