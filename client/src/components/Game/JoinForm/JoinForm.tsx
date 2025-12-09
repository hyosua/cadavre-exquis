"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/hooks/useGame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "framer-motion";
import { Ticket, User, ArrowLeft, AlertTriangle } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";

export default function JoinGame() {
  const router = useRouter();
  const { joinGame, game } = useGame();
  const [pseudo, setPseudo] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (game && isJoining) {
      router.push(`/game/${game.id}`);
    }
  }, [game, isJoining, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pseudo.trim()) {
      setError("Il te faut un nom de scène !");
      return;
    }

    if (!code.trim()) {
      setError("Sans ticket, pas d'entrée.");
      return;
    }

    if (code.length !== 6) {
      setError("Le code doit faire 6 caractères.");
      return;
    }
    joinGame(code.toUpperCase(), pseudo.trim());
    setIsJoining(true);
  };

  // Écran de chargement stylisé
  if (isJoining) {
    return (
      <div className="min-h-screen flex flex-col gap-6 items-center justify-center bg-background p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Ticket size={64} className="text-primary" />
        </motion.div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-averia font-bold text-foreground">
            Vérification du ticket...
          </h2>
          <div className="inline-block bg-card border-2 border-foreground px-4 py-2 rounded-lg font-mono text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {code.toUpperCase()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-md"
      >
        {/* La Carte Principale (pop-card) */}
        <Card className="pop-card p-8 bg-card relative overflow-hidden">
          <CardTitle className="text-center text-3xl font-averia font-bold -rotate-1 drop-shadow-sm">
            Rejoindre une partie
          </CardTitle>
          {/* Décoration de coin */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-300 rounded-full border-2 border-foreground z-0" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Input Pseudo */}
            <div className="space-y-2">
              <label className="text-lg sm:text-xl font-bold font-averia flex items-center gap-2 ml-1">
                <User size={20} /> Ton Pseudo
              </label>
              <Input
                value={pseudo}
                onChange={(e) => {
                  setPseudo(e.target.value);
                  setError("");
                }}
                placeholder="Ex: victor_Hugo"
                maxLength={20}
                // Style pop-input
                className="pop-input h-12 px-4 text-lg sm:text-2xl"
                autoFocus
              />
            </div>

            {/* Input Code (Style Ticket) */}
            <div className="space-y-2">
              <label className="text-lg sm:text-xl font-bold font-averia flex items-center gap-2 ml-1">
                <Ticket size={20} /> Code de la partie
              </label>
              <div className="relative">
                <Input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setError("");
                  }}
                  placeholder="ABC123"
                  maxLength={6}
                  // Style pop-input spécifique pour le code
                  className="pop-input text-2xl sm:text-4xl h-20 text-center font-mono tracking-[0.2em] uppercase placeholder:text-muted-foreground/20 bg-yellow-50 focus-visible:bg-white transition-colors"
                />
                {/* Petit texte déco */}
                <span className="absolute right-3 bottom-2 text-[10px] sm:text-[12px] text-muted-foreground font-mono opacity-50">
                  TICKET #001
                </span>
              </div>
            </div>

            {/* Zone d'erreur Fun */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-destructive/10 border-2 border-destructive border-dashed rounded-lg p-3 flex items-start gap-3 text-destructive"
              >
                <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-bold font-averia leading-tight">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Boutons d'action */}
            <div className="space-y-4 pt-2">
              <Button
                type="submit"
                // Style pop-btn
                className="pop-btn w-full h-14 text-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none"
              >
                Valider mon ticket !
              </Button>

              <div className="text-center">
                <Button
                  asChild
                  type="button"
                  variant="link"
                  className="text-muted-foreground hover:text-foreground font-averia text-base"
                >
                  <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft size={16} /> Retour à l&apos;accueil
                  </Link>
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
