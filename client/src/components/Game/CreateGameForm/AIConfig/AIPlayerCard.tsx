import { Bot, Trash2, Sparkles, Brain, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { AICreativity } from "@/types/game.type";
import { AIPlayerConfigProps } from "@/types/ai-config.type";

const creativityConfig = {
  strict: {
    icon: Target,
    label: "Précis",
    description: "Réponses courtes et directes",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    progressColor: "bg-blue-500",
  },
  equilibre: {
    icon: Brain,
    label: "Équilibré",
    description: "Mix entre précision et créativité",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    progressColor: "bg-purple-500",
  },
  creatif: {
    icon: Sparkles,
    label: "Créatif",
    description: "Réponses originales et surprenantes",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    progressColor: "bg-amber-500",
  },
};

export function AIPlayerCard({
  aiPlayer,
  onRemove,
  onCreativityChange,
}: AIPlayerConfigProps) {
  const config = creativityConfig[aiPlayer.creativity];
  const Icon = config.icon;

  const creativityValue =
    aiPlayer.creativity === "strict"
      ? 33
      : aiPlayer.creativity === "equilibre"
      ? 66
      : 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-md transition-all duration-200"
    >
      {/* Gradient de fond subtil */}
      <div
        className={`absolute inset-0 ${config.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
      />

      <div className="relative p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Infos du joueur */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${config.bgColor} flex-shrink-0`}>
              <Bot className={`w-5 h-5 ${config.color}`} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Sélecteur de créativité */}
              <Select
                value={aiPlayer.creativity}
                onValueChange={(value: AICreativity) =>
                  onCreativityChange(aiPlayer.id, value)
                }
              >
                <SelectTrigger
                  className={`h-8 w-full ${config.bgColor} border-muted-foreground/20 hover:bg-background hover:border-muted-foreground/40 transition-colors`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-semibold text-base truncate">
                      {aiPlayer.pseudo}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs flex-shrink-0"
                    >
                      IA
                    </Badge>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(creativityConfig) as [
                      AICreativity,
                      typeof creativityConfig.strict
                    ][]
                  ).map(([key, cfg]) => {
                    const ItemIcon = cfg.icon;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <ItemIcon className={`w-4 h-4 ${cfg.color}`} />
                          <div className="flex flex-col">
                            <span className="font-medium">{cfg.label}</span>
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
          </div>

          {/* Bouton supprimer */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(aiPlayer.id)}
            className="h-8 w-8 p-0 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 size={16} />
          </Button>
        </div>

        {/* Indicateur visuel de créativité */}
        <div className="mt-3 flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${config.color}`} />
          <Progress
            value={creativityValue}
            indicatorClassName={config.progressColor}
            className="h-1.5 flex-1"
          />
        </div>
      </div>
    </motion.div>
  );
}
