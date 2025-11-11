"use client";

import dynamic from "next/dynamic";
import { CreateGameFormShell } from "@/components/Game/CreateGameForm/CreateGameFormShell";

const DynamicCreateGameForm = dynamic(
  () =>
    import("@/components/Game/CreateGameForm/index").then(
      (mod) => mod.CreateGameForm
    ),
  {
    loading: () => <CreateGameFormShell />,
    ssr: false,
  }
);

export default function CreateGame() {
  return <DynamicCreateGameForm />;
}
