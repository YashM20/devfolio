import type { Registry } from "shadcn/schema";

export const examples: Registry["items"] = [
  {
    name: "minimal-ai-assistant-demo",
    type: "registry:example",
    registryDependencies: ["<registryBaseUrl>/minimal-ai-assistant.json"],
    files: [
      {
        path: "examples/minimal-ai-assistant-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "simple-chat-api-route",
    type: "registry:example",
    registryDependencies: ["<registryBaseUrl>/minimal-ai-assistant.json"],
    files: [
      {
        path: "examples/simple-chat-api-route.ts",
        type: "registry:example",
      },
    ],
  },
];
