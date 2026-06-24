"use client";

import dynamic from "next/dynamic";

const AiAssistant = dynamic(
  () => import("./ai-assistant").then((mod) => mod.AiAssistant),
  { ssr: false }
);

export function AiAssistantWrapper() {
  return <AiAssistant />;
}
