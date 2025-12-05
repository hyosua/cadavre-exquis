import { Trash2 } from "lucide-react";
import { PiMaskSadFill } from "react-icons/pi";
import { GiClown, GiBrain, GiPirateSkull } from "react-icons/gi";
import { IoIosRose } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Personnality } from "@/types/game.type";
import { AIPlayerConfigProps } from "@/types/ai-config.type";

export const personnalityConfig = {
  scientifique: {
    icon: GiBrain,
    label: "Le Scientifique",
    description: "est froid, descriptif et technique",
    color: "text-blue-500",
    colorValue: "#4299e1",
    bgColor: "bg-blue-500/10",
    progressColor: "bg-blue-500",
  },
  comique: {
    icon: GiClown,
    label: "Le Comique",
    description: "répond toujours de manière absurde",
    color: "text-purple-500",
    colorValue: "#6b21a8",
    bgColor: "bg-purple-500/20",
  },
  grognon: {
    icon: PiMaskSadFill,
    label: "Le Grognon",
    description: "voit le monde en noir",
    color: "text-slate-800",
    colorValue: "#1E293B",
    bgColor: "bg-slate-800/20",
  },
  pirate: {
    icon: GiPirateSkull,
    label: "Le Pirate",
    description: "est obsédé par la piraterie",
    color: "text-emerald-500",
    colorValue: "#059669",
    bgColor: "bg-emerald-500/20",
  },
  romantique: {
    icon: IoIosRose,
    label: "Le Romantique",
    description: "est rempli d'amour et de passion",
    color: "text-pink-500",
    colorValue: "#db2777",
    bgColor: "bg-pink-500/20",
  },
};

export function AIPlayerCard({
  aiPlayer,
  onRemove,
  onPersonnalityChange,
}: AIPlayerConfigProps) {
  const config = personnalityConfig[aiPlayer.personnality];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      // STYLE POP-BASE
      className="pop-base relative overflow-hidden rounded-lg bg-card group"
    >
      {/* Bande de couleur latérale */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-2 ${config.bgColor} border-r-2 border-foreground`}
      />

      <div className="relative p-2 pl-5 flex items-center gap-3">
        {/* Icône avatar */}
        <div
          className={`w-10 h-10 rounded-full border-2 border-foreground flex items-center justify-center ${config.bgColor} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
        >
          <Icon size={20} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Sélecteur de personnalité */}
          <Select
            value={aiPlayer.personnality}
            onValueChange={(value: Personnality) =>
              onPersonnalityChange(aiPlayer.id, value)
            }
          >
            <SelectTrigger
              className={`h-8 w-full ${config.bgColor} border-muted-foreground/20 hover:bg-background hover:border-muted-foreground/40 transition-colors`}
            >
              <div className="flex items-center gap-2 w-full">
                <span className="font-averia font-semibold text-sm sm:text-lg truncate">
                  {config.label}
                </span>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  IA
                </Badge>
              </div>
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(personnalityConfig) as [
                  Personnality,
                  typeof personnalityConfig.comique
                ][]
              ).map(([key, cfg]) => {
                const ItemIcon = cfg.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <ItemIcon size={16} color={cfg.colorValue} />
                      <div className="flex flex-col">
                        <span className="font-averia font-medium">
                          {cfg.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {cfg.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {/* Bouton supprimer */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(aiPlayer.id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {/* Indicateur visuel de personnalité */}
      <p className="text-sm my-1 text-center sm:text-lg italic">
        {config.description}
      </p>
    </motion.div>
  );
}
