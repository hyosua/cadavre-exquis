// components/Game/CreateGameForm/CreateGameFormShell.tsx
"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export function CreateGameFormShell() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-4 animate-in fade-in duration-300">
      <div className="max-w-2xl mx-auto mt-2 sm:mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Créer une nouvelle partie</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Pseudo - Affichage instantané */}
            <div className="space-y-2">
              <Label htmlFor="pseudo" className="text-lg font-semibold">
                Pseudo
              </Label>
              <Input
                id="pseudo"
                placeholder="Votre nom de joueur"
                disabled
                className="opacity-50"
              />
            </div>

            {/* Mode de jeu - Skeleton avec shine */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Mode de jeu</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-24 w-full rounded-md relative overflow-hidden"
                  >
                    <div className="absolute inset-0 animate-shine" />
                  </Skeleton>
                ))}
              </div>
            </div>

            {/* Temps par phase - Skeleton avec shine */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Temps par phase</Label>
              <div className="flex items-center gap-4">
                <Skeleton className="h-2 flex-1 rounded-md relative overflow-hidden">
                  <div className="absolute inset-0 animate-shine" />
                </Skeleton>
                <Skeleton className="h-9 w-16 rounded-md relative overflow-hidden">
                  <div className="absolute inset-0 animate-shine" />
                </Skeleton>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex sm:flex-row justify-center gap-2 sm:gap-8">
            <Button
              variant="destructive"
              size="lg"
              className="w-1/2"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
            <Button type="button" size="lg" className="w-1/2" disabled>
              Créer la partie
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
