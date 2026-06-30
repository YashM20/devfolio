import type { Registry } from "shadcn/schema";

export const components: Registry["items"] = [
  {
    name: "minimal-ai-assistant",
    type: "registry:component",
    description:
      "A minimal, customizable AI assistant component with multiple themes and chat functionality.",
    title: "Minimal AI Assistant",
    author: "yash_mhj",
    dependencies: ["motion", "@ai-sdk/react", "lucide-react"],
    registryDependencies: ["<registryBaseUrl>/utils.json"],
    files: [
      {
        path: "minimal-ai-assistant/ai-assistant.tsx",
        type: "registry:component",
      },
    ],
  },
];
