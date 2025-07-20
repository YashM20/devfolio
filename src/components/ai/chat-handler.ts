import { UIMessage } from "ai";
import { checkAndUpdateRateLimit, getClientIP } from "./rate-limiter";
import {
  handleChatError,
  validateChatRequest,
  checkApiKey,
} from "./error-handler";

interface ChatHandlerResult {
  success: boolean;
  response?: Response;
  messages?: UIMessage[];
}

export async function prepareChatRequest(
  req: Request
): Promise<ChatHandlerResult> {
  try {
    console.log("🔍 API Route called - /api/chat");

    // Rate limiting check
    const clientIP = getClientIP(req);
    console.log("🔒 Rate limiting check for IP:", clientIP);

    const rateLimitResult = checkAndUpdateRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      console.log("❌ Rate limit exceeded for IP:", clientIP);
      return {
        success: false,
        response: Response.json(
          { error: rateLimitResult.message },
          { status: 429 }
        ),
      };
    }

    console.log("✅ Rate limit check passed for IP:", clientIP);

    // Check if API key is configured
    const apiKeyError = checkApiKey();
    if (apiKeyError) {
      return {
        success: false,
        response: apiKeyError,
      };
    }

    console.log("📥 Parsing request body...");
    const body = await req.json();
    console.log(
      "📝 Messages received:",
      body.messages?.length || 0,
      "messages"
    );

    // Validate request
    const validation = validateChatRequest(body);
    if (!validation.isValid) {
      return {
        success: false,
        response: validation.error!,
      };
    }

    const messages = validation.messages!;

    console.log("✅ All validations passed, ready to process chat");
    return {
      success: true,
      messages,
    };
  } catch (error) {
    return {
      success: false,
      response: handleChatError(error),
    };
  }
}
