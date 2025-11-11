import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function CreateGameFormSkeleton() {
  return (
    <div className="min-h-screen p-4 animate-in fade-in duration-300">
      <div className="max-w-2xl mx-auto mt-2 sm:mt-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 rounded-md" />
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Champ Pseudo */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Sélecteur de mode de jeu */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full rounded-md animate-pulse" />
                <Skeleton className="h-24 w-full rounded-md animate-pulse" />
                <Skeleton className="h-24 w-full rounded-md animate-pulse" />
              </div>
            </div>

            {/* Slider du temps par phase */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-40 rounded-md" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-2 flex-1 rounded-md" />
                <Skeleton className="h-9 w-16 rounded-md" />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex sm:flex-row justify-center gap-2 sm:gap-8">
            <Skeleton className="h-10 w-1/2 rounded-md" />
            <Skeleton className="h-10 w-1/2 rounded-md" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
