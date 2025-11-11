"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/ui/loader";
import { CreateGameFormSkeleton } from "@/components/squeletons/CreateGameSkeleton";

const DynamicCreateGameForm = dynamic(
  () =>
    import("@/components/Game/CreateGameForm/index").then(
      (mod) => mod.CreateGameForm
    ),
  {
    loading: () => <CreateGameFormSkeleton />,
    ssr: false,
  }
);

export default function CreateGame() {
  return <DynamicCreateGameForm />;
}
