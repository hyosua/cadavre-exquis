// src/components/Game/JoinForm/Join.skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function JoinFormSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          className="bg-card rounded-2xl shadow-xl p-8 dark:glow-shadow"
          initial={{ opacity: 0, filter: "blur(8px)", scale: 0.8 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">
            Rejoindre une partie
          </h1>

          <div className="space-y-6">
            {/* Input Pseudo - hauteur exacte avec padding */}
            <Skeleton className="h-[42px] w-full rounded-md" />

            {/* Input Code - plus grand avec font-mono */}
            <Skeleton className="h-[56px] w-full rounded-md" />

            <div className="space-y-3">
              {/* Bouton Rejoindre */}
              <Skeleton className="h-[40px] w-full rounded-md" />

              {/* Bouton Retour */}
              <Skeleton className="h-[40px] w-full rounded-md" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
