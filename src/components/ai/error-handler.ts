import { UIMessage } from "ai";

export function handleChatError(error: unknown): Response {
  console.error("Error in chat API:", error);

  // Provide more specific error messages
  if (error instanceof Error) {
    if (error.message.includes("API key")) {
      return Response.json(
        {
          error:
            "Invalid or missing API key. Please check your Google Gemini API configuration.",
        },
        { status: 401 }
      );
    }
    if (error.message.includes("quota") || error.message.includes("limit")) {
      return Response.json(
        { error: "API quota exceeded. Please try again later." },
        { status: 429 }
      );
    }
    if (
      error.message.includes("network") ||
      error.message.includes("timeout")
    ) {
      return Response.json(
        {
          error: "Network error. Please check your connection and try again.",
        },
        { status: 503 }
      );
    }
  }

  return Response.json(
    { error: "An unexpected error occurred. Please try again." },
    { status: 500 }
  );
}

export function validateChatRequest(body: any): {
  isValid: boolean;
  error?: Response;
  messages?: UIMessage[];
} {
  // Validate request
  if (!body.messages || !Array.isArray(body.messages)) {
    console.log("❌ Invalid request format");
    return {
      isValid: false,
      error: Response.json(
        { error: "Invalid request format" },
        { status: 400 }
      ),
    };
  }

  return {
    isValid: true,
    messages: body.messages as UIMessage[],
  };
}

export function checkApiKey(): Response | null {
  console.log(
    "🔑 Checking API key - exists:",
    !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
  );
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.log("❌ API key not found");
    return Response.json(
      {
        error:
          "Google Gemini API key is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
      },
      { status: 500 }
    );
  }
  return null;
}
