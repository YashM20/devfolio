import posthog from "posthog-js";

// Define event types for better type safety and consistency
export type PostHogEventName =
  | "ai_chat_opened"
  | "ai_chat_closed"
  | "ai_message_sent"
  | "ai_suggestion_clicked"
  | "ai_chat_cleared"
  | "ai_response_received"
  | "ai_response_error"
  | "ai_tool_used";

// Event properties interfaces
export interface AIEventProperties {
  message_length?: number;
  suggestion?: string;
  error_type?: string;
  tool_name?: string;
  response_time?: number;
  conversation_length?: number;
  session_id?: string;
}

export type EventProperties = AIEventProperties;

// Utility function to safely capture events
export function captureEvent(
  eventName: PostHogEventName,
  properties?: EventProperties
) {
  if (typeof window === "undefined") return;

  try {
    // Add common properties to all events
    const commonProperties = {
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      ...properties,
    };

    posthog.capture(eventName, commonProperties);

    // Log in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("📊 PostHog Event:", eventName, commonProperties);
    }
  } catch (error) {
    console.warn("Failed to capture PostHog event:", error);
  }
}

// Specific event capture functions for better developer experience
export const posthogEvents = {
  // AI Assistant Events
  ai: {
    chatOpened: (properties?: Partial<AIEventProperties>) =>
      captureEvent("ai_chat_opened", properties),

    chatClosed: (properties?: Partial<AIEventProperties>) =>
      captureEvent("ai_chat_closed", properties),

    messageSent: (
      messageLength: number,
      conversationLength?: number,
      sessionId?: string
    ) =>
      captureEvent("ai_message_sent", {
        message_length: messageLength,
        conversation_length: conversationLength,
        session_id: sessionId,
      }),

    suggestionClicked: (suggestion: string, sessionId?: string) =>
      captureEvent("ai_suggestion_clicked", {
        suggestion,
        session_id: sessionId,
      }),

    chatCleared: (conversationLength?: number, sessionId?: string) =>
      captureEvent("ai_chat_cleared", {
        conversation_length: conversationLength,
        session_id: sessionId,
      }),

    responseReceived: (
      responseTime: number,
      toolUsed?: string,
      sessionId?: string
    ) =>
      captureEvent("ai_response_received", {
        response_time: responseTime,
        tool_name: toolUsed,
        session_id: sessionId,
      }),

    responseError: (errorType: string, sessionId?: string) =>
      captureEvent("ai_response_error", {
        error_type: errorType,
        session_id: sessionId,
      }),

    toolUsed: (toolName: string, sessionId?: string) =>
      captureEvent("ai_tool_used", {
        tool_name: toolName,
        session_id: sessionId,
      }),
  },
};

// Session management for AI chat
export function generateAIChatSessionId(): string {
  return `ai_session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
