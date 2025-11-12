// src/app/join/page.tsx
"use client";

import dynamic from "next/dynamic";
import { JoinFormSkeleton } from "@/components/Game/JoinForm/Join.skeleton";

const DynamicJoinForm = dynamic(
  () =>
    import("@/components/Game/JoinForm/JoinForm").then((mod) => mod.default),
  {
    loading: () => <JoinFormSkeleton />,
    ssr: false,
  }
);

export default function JoinPage() {
  return <DynamicJoinForm />;
}
