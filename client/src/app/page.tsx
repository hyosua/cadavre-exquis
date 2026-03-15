"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { phrases } from "@/lib/phrases";
import { useEffect, useMemo, useState } from "react";

function TypeText({
  typingSpeed = 70,
  pause = 950,
}: {
  typingSpeed?: number;
  pause?: number;
}) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const current = useMemo(() => phrases[index % phrases.length], [index]);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!deleting && subIndex < current.length) {
          setSubIndex((v) => v + 1);
          return;
        }
        if (!deleting && subIndex === current.length) {
          setDeleting(true);
          return;
        }
        if (deleting && subIndex > 0) {
          setSubIndex((v) => v - 1);
          return;
        }
        if (deleting && subIndex === 0) {
          setDeleting(false);
          setIndex((i) => i + 1);
        }
      },
      deleting
        ? Math.max(typingSpeed / 2, 25)
        : subIndex === current.length
          ? pause
          : typingSpeed,
    );
    return () => clearTimeout(timeout);
  }, [current, deleting, pause, subIndex, typingSpeed]);

  return <span className="whitespace-pre">{current.slice(0, subIndex)}</span>;
}

const grammarCards = [
  {
    label: "Sujet",
    example: "Le chat...",
    bg: "bg-blue-100 dark:bg-blue-950/60",
    border: "border-blue-400",
    text: "text-blue-700 dark:text-blue-300",
  },
  {
    label: "Adjectif",
    example: "...mystérieux...",
    bg: "bg-yellow-100 dark:bg-yellow-950/60",
    border: "border-yellow-400",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  {
    label: "Verbe",
    example: "...murmure...",
    bg: "bg-green-100 dark:bg-green-950/60",
    border: "border-green-400",
    text: "text-green-700 dark:text-green-300",
  },
  {
    label: "Complément",
    example: "...des étoiles",
    bg: "bg-pink-100 dark:bg-pink-950/60",
    border: "border-pink-400",
    text: "text-pink-700 dark:text-pink-300",
  },
];

const steps = [
  {
    number: "1",
    title: "Créez & invitez",
    desc: "Un joueur crée une partie et partage le code avec ses amis.",
  },
  {
    number: "2",
    title: "Écrivez en secret",
    desc: "Chaque joueur contribue un mot dans sa catégorie grammaticale, sans voir les autres.",
  },
  {
    number: "3",
    title: "Assemblez",
    desc: "Les mots sont réunis pour créer des phrases surprenantes et décalées !",
  },
  {
    number: "4",
    title: "Votez & gagnez",
    desc: "Votez pour la phrase la plus loufoque et découvrez le classement !",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="flex flex-col items-center text-center px-4 pt-20 pb-16 relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-10 -right-20 w-72 h-72 rounded-full bg-secondary/10 blur-3xl"
        />

        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="text-6xl sm:text-9xl font-title font-bold text-primary drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] -rotate-1 mb-6"
        >
          Cadavre Exquis
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-lg mb-4 font-averia"
        >
          Le jeu littéraire surréaliste où chaque joueur contribue à créer des
          phrases complètement inattendues.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="font-averia text-xl sm:text-3xl text-foreground min-h-[2.5rem] sm:min-h-[3rem] mb-10 italic"
        >
          &ldquo;
          <TypeText />
          &rdquo;
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.35, delay: 0.38 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-md"
        >
          <Button
            asChild
            variant="secondary"
            className="h-14 text-lg pop-btn flex-1"
          >
            <Link href="/create">Créer une partie</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="h-14 text-lg pop-btn flex-1"
          >
            <Link href="/join" prefetch>
              Rejoindre
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* ── EXEMPLE DE PHRASE ── */}
      <section className="px-4 py-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="pop-card p-8 text-center"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
            Exemple de phrase générée
          </p>
          <div className="flex flex-wrap justify-center gap-3 font-averia text-xl sm:text-2xl">
            <span className="px-3 py-1.5 rounded-xl border-2 border-blue-400 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold">
              Le chat
            </span>
            <span className="px-3 py-1.5 rounded-xl border-2 border-yellow-400 bg-yellow-100 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-300 font-bold">
              mystérieux
            </span>
            <span className="px-3 py-1.5 rounded-xl border-2 border-green-400 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 font-bold">
              murmure
            </span>
            <span className="px-3 py-1.5 rounded-xl border-2 border-pink-400 bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-bold">
              des étoiles
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-averia">
            Chaque couleur = une contribution de joueurs différents
          </p>
        </motion.div>
      </section>

      {/* ── GRAMMAIRE ── */}
      <section className="px-4 py-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Maîtrisez la grammaire
          </h2>
          <p className="text-muted-foreground font-averia text-lg">
            Chaque partie vous fait pratiquer les catégories grammaticales
            françaises
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {grammarCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className={`pop-card p-5 text-center ${card.bg}`}
            >
              <div className={`font-bold text-lg mb-1 ${card.text}`}>
                {card.label}
              </div>
              <div className="text-sm text-muted-foreground font-averia italic">
                {card.example}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── COMMENT JOUER ── */}
      <section className="px-4 py-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Comment jouer ?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.09 }}
              className="pop-card p-6 flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl border-2 border-foreground bg-accent flex items-center justify-center text-xl font-bold text-accent-foreground">
                {step.number}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                <p className="text-muted-foreground font-averia text-sm sm:text-base">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-xl mx-auto pop-card p-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3">
            Prêt à jouer ?
          </h2>
          <p className="text-muted-foreground font-averia mb-8 text-lg">
            Invitez vos amis et créez des phrases inoubliables !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="secondary"
              className="h-14 text-lg pop-btn px-8"
            >
              <Link href="/create">Créer une partie</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="h-14 text-lg pop-btn px-8"
            >
              <Link href="/join">Rejoindre</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
