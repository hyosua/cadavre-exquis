import React from "react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface CodeCopyBtnProps {
  codeToCopy: string;
}

/**
 * Copie le texte fourni en paramètre et affiche l'icone Check si la copie est réussie
 */

const CodeCopyBtn: React.FC<CodeCopyBtnProps> = ({ codeToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (isCopied) return;

    try {
      await navigator.clipboard.writeText(codeToCopy);

      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (err) {
      console.error("Erreur, impossible de copier le code.", err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={isCopied}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            disabled={isCopied}
            aria-label="Copier le code"
            size="icon"
            onClick={handleCopy}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isCopied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{
                    scale: 0.8,
                    opacity: 0,
                    transition: { duration: 0.05 },
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check size={12} className="text-white" />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.01 }}
                >
                  <Copy size={12} />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-accent text-base-300 font-semibold">
          <p>Copié !</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CodeCopyBtn;
