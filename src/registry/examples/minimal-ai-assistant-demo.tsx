"use client";

import {
  AiAssistantProvider,
  AiAssistantTrigger,
  AiAssistantChat,
  AiAssistantHeader,
  AiAssistantHeaderTitle,
  AiAssistantHeaderActions,
  AiAssistantMessages,
  AiAssistantEmptyState,
  AiAssistantMessageList,
  AiAssistantInput,
} from "@/registry/minimal-ai-assistant/ai-assistant";

export default function MinimalAiAssistantDemo() {
  return (
    <div className="relative h-96 w-full rounded-lg border bg-gradient-to-br from-green-50 to-emerald-100 p-6 dark:from-green-950/20 dark:to-emerald-950/20">
      <div className="mb-4">
        <h3 className="font-semibold">AI Assistant Demo</h3>
        <p className="text-muted-foreground text-sm">
          Built with composable components following shadcn/ui patterns
        </p>
      </div>

      <AiAssistantProvider
        onMessageSent={(msg) => console.log("Sent:", msg)}
        onResponse={(response) => console.log("Response:", response)}
        onError={(error) => console.error("Error:", error)}
      >
        <div className="flex gap-4">
          <AiAssistantTrigger
            variant="secondary"
            size="lg"
            position="bottom-right"
          >
            Chat with AI
          </AiAssistantTrigger>

          <AiAssistantTrigger variant="outline" position="static" asChild>
            <button className="border-primary/50 hover:bg-primary/5 rounded-lg border-2 border-dashed px-4 py-2 text-sm font-medium transition-colors">
              Custom Button
            </button>
          </AiAssistantTrigger>
        </div>

        <AiAssistantChat
          className="mb-[5vh] max-h-[90vh]"
          position="bottom-center"
          variant="default"
          size="lg"
        >
          <AiAssistantHeader>
            <AiAssistantHeaderTitle>🤖 AI Assistant</AiAssistantHeaderTitle>
            <AiAssistantHeaderActions />
          </AiAssistantHeader>

          <AiAssistantMessages>
            <AiAssistantEmptyState
              suggestions={[
                "What can you do?",
                "Tell me about this component",
                "How do I customize it?",
              ]}
            />
            <AiAssistantMessageList />
          </AiAssistantMessages>

          <AiAssistantInput placeholder="Ask me anything..." maxLength={1000} />
        </AiAssistantChat>
      </AiAssistantProvider>
    </div>
  );
}
