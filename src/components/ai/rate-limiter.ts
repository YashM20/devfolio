// Rate limiting storage (in-memory)
interface RateLimitData {
  count: number;
  date: string;
}

const userRequests = new Map<string, RateLimitData>();
const globalRequests = { count: 0, date: new Date().toDateString() };

// Rate limiting constants
const MAX_USER_REQUESTS_PER_DAY = 100;
const MAX_GLOBAL_REQUESTS_PER_DAY = 10000;

// Helper functions for rate limiting
function getClientIP(req: Request): string {
  // Try to get real IP from various headers
  const xForwardedFor = req.headers.get("x-forwarded-for");
  const xRealIP = req.headers.get("x-real-ip");
  const cfConnectingIP = req.headers.get("cf-connecting-ip");

  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  if (xRealIP) {
    return xRealIP.trim();
  }
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }

  // Fallback to a default value
  return "unknown-ip";
}

function isNewDay(date: string): boolean {
  return date !== new Date().toDateString();
}

export function checkAndUpdateRateLimit(clientIP: string): {
  allowed: boolean;
  message?: string;
} {
  const today = new Date().toDateString();

  // Reset global counter if new day
  if (isNewDay(globalRequests.date)) {
    globalRequests.count = 0;
    globalRequests.date = today;
  }

  // Check global limit
  if (globalRequests.count >= MAX_GLOBAL_REQUESTS_PER_DAY) {
    return {
      allowed: false,
      message: "Daily global message limit reached. Please try again tomorrow.",
    };
  }

  // Get or initialize user data
  let userData = userRequests.get(clientIP);
  if (!userData || isNewDay(userData.date)) {
    userData = { count: 0, date: today };
    userRequests.set(clientIP, userData);
  }

  // Check user limit
  if (userData.count >= MAX_USER_REQUESTS_PER_DAY) {
    return {
      allowed: false,
      message:
        "Daily message limit reached (100 messages per day). Please try again tomorrow.",
    };
  }

  // Update counters
  userData.count++;
  globalRequests.count++;

  return { allowed: true };
}

export { getClientIP };
