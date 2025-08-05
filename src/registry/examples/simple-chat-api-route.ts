// Simple API route example for minimal-ai-assistant
// Save this as: app/api/chat/route.ts

import { google } from "@ai-sdk/google";
import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  generateId,
} from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Using createUIMessageStream for better streaming experience
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const result = streamText({
          model: google("gemini-2.5-flash"),
          system: "You are a helpful assistant. Be concise and friendly.",
          messages: convertToModelMessages(messages),
        });

        result.consumeStream();

        writer.merge(
          result.toUIMessageStream({
            sendReasoning: false,
          })
        );
      },
      generateId: () => generateId(),
      onFinish: async ({ messages }) => {
        console.log("✅ Chat completed with", messages.length, "messages");
      },
      onError: () => {
        return "Oops, an error occurred!";
      },
    });

    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Error processing request", { status: 500 });
  }
}

// Simple version (alternative)
export async function simpleVersion(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages,
      system: "You are a helpful assistant. Be concise and friendly.",
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
