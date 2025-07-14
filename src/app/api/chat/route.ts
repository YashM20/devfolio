import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";

import { USER } from "@/data/user";
import { EXPERIENCES } from "@/features/profile/data/experiences";
import { PROJECTS } from "@/features/profile/data/projects";
import { TECH_STACK } from "@/features/profile/data/tech-stack";
import { getAllPosts } from "@/data/blog";

// Get all posts for context
const allPosts = getAllPosts();

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

/**
 * Extracts the client's IP address from the request headers, checking common proxy headers and falling back to a default value if none are found.
 *
 * @param req - The incoming HTTP request
 * @returns The detected client IP address, or "unknown-ip" if not available
 */
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

/**
 * Determines whether the provided date string represents a different day than today.
 *
 * @param date - A date string to compare, typically in the format returned by `toDateString()`
 * @returns `true` if the date is not today; otherwise, `false`
 */
function isNewDay(date: string): boolean {
  return date !== new Date().toDateString();
}

/**
 * Checks and updates rate limits for a given client IP, enforcing both per-user and global daily limits.
 *
 * @param clientIP - The IP address of the client making the request
 * @returns An object indicating whether the request is allowed and, if not, a message explaining the limit reached
 */
function checkAndUpdateRateLimit(clientIP: string): {
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

// Personal context for the AI assistant
const personalContext = `
You are an AI assistant for ${USER.displayName}'s portfolio website. Here's key information about ${USER.firstName}:

PERSONAL INFO:
- Name: ${USER.displayName}
- Job Title: ${USER.jobTitle}
- Location: ${USER.address}
- Bio: ${USER.bio}
- About: ${USER.about}
- Website: ${USER.website}
- Skills: ${USER.flipSentences.join(", ")}

CURRENT POSITIONS:
${USER.jobs.map((job) => `- ${job.title} at ${job.company} (${job.website})`).join("\n")}

EXPERIENCE:
${EXPERIENCES.map(
  (exp) => `
Company: ${exp.companyName}
Positions: ${exp.positions.map((pos) => `${pos.title} (${pos.employmentPeriod.start} - ${pos.employmentPeriod.end || "Present"})`).join(", ")}
`
).join("\n")}

PROJECTS:
${PROJECTS.map(
  (project) => `
- ${project.title} (${project.period.start} - ${project.period.end || "Present"})
  Skills: ${project.skills.join(", ")}
  Description: ${project.description}
`
).join("\n")}

TECH STACK:
${TECH_STACK.map((tech) => `- ${tech.title}: ${tech.href}`).join("\n")}

BLOG POSTS:
${allPosts.map((post) => `- ${post.metadata.title}: ${post.metadata.description}`).join("\n")}

Instructions:
- Answer questions about ${USER.firstName}'s experience, projects, skills, and background
- Be helpful and informative
- Speak in first person when representing ${USER.firstName}
- If asked about contact information, direct them to use the contact methods on the website
- If you don't know something specific, be honest about it
- Keep responses conversational and professional
`;

/**
 * Handles POST requests to the AI chat endpoint, providing a rate-limited, streaming AI assistant for a portfolio website.
 *
 * Validates API key and request format, enforces per-user and global rate limits, and integrates with Google Gemini AI to answer questions about the user's portfolio, projects, experience, tech stack, and blog posts. Supports enhanced querying through custom search tools and returns responses as a streaming data response.
 */
export async function POST(req: Request) {
  console.log("🔍 API Route called - /api/chat");

  try {
    // Rate limiting check
    const clientIP = getClientIP(req);
    console.log("🔒 Rate limiting check for IP:", clientIP);

    const rateLimitResult = checkAndUpdateRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      console.log("❌ Rate limit exceeded for IP:", clientIP);
      return Response.json({ error: rateLimitResult.message }, { status: 429 });
    }

    console.log("✅ Rate limit check passed for IP:", clientIP);

    // Check if API key is configured
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

    console.log("📥 Parsing request body...");
    const { messages } = await req.json();
    console.log("📝 Messages received:", messages?.length || 0, "messages");

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      console.log("❌ Invalid request format");
      return Response.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    console.log("🚀 Calling streamText with Gemini model...");
    const result = await streamText({
      model: google("gemini-1.5-flash"),
      system: personalContext,
      messages,
      tools: {
        searchProjects: tool({
          description: "Search through projects based on technology or keyword",
          parameters: z.object({
            query: z.string().describe("The search query for projects"),
          }),
          execute: async ({ query }) => {
            const filteredProjects = PROJECTS.filter(
              (project) =>
                project.title.toLowerCase().includes(query.toLowerCase()) ||
                project.description
                  ?.toLowerCase()
                  .includes(query.toLowerCase()) ||
                project.skills.some((skill) =>
                  skill.toLowerCase().includes(query.toLowerCase())
                )
            );
            return {
              projects: filteredProjects.map((project) => ({
                title: project.title,
                period: `${project.period.start} - ${project.period.end || "Present"}`,
                skills: project.skills,
                description: project.description,
              })),
            };
          },
        }),
        searchBlogPosts: tool({
          description: "Search through blog posts based on title or content",
          parameters: z.object({
            query: z.string().describe("The search query for blog posts"),
          }),
          execute: async ({ query }) => {
            const filteredPosts = allPosts.filter(
              (post) =>
                post.metadata.title
                  .toLowerCase()
                  .includes(query.toLowerCase()) ||
                post.metadata.description
                  .toLowerCase()
                  .includes(query.toLowerCase()) ||
                post.content.toLowerCase().includes(query.toLowerCase())
            );
            return {
              posts: filteredPosts.map((post) => ({
                title: post.metadata.title,
                description: post.metadata.description,
                createdAt: post.metadata.createdAt,
                slug: post.slug,
              })),
            };
          },
        }),
        getTechStack: tool({
          description: "Get information about technologies in the tech stack",
          parameters: z.object({
            category: z
              .string()
              .optional()
              .describe("Filter by category (e.g., Framework, Library, etc.)"),
          }),
          execute: async ({ category }) => {
            const filteredTech = category
              ? TECH_STACK.filter((tech) => tech.categories.includes(category))
              : TECH_STACK;

            return {
              technologies: filteredTech.map((tech) => ({
                title: tech.title,
                href: tech.href,
                categories: tech.categories,
              })),
            };
          },
        }),
        getExperience: tool({
          description: "Get detailed information about work experience",
          parameters: z.object({
            company: z.string().optional().describe("Filter by company name"),
          }),
          execute: async ({ company }) => {
            const filteredExp = company
              ? EXPERIENCES.filter((exp) =>
                  exp.companyName.toLowerCase().includes(company.toLowerCase())
                )
              : EXPERIENCES;

            return {
              experiences: filteredExp.map((exp) => ({
                company: exp.companyName,
                positions: exp.positions.map((pos) => ({
                  title: pos.title,
                  period: `${pos.employmentPeriod.start} - ${pos.employmentPeriod.end || "Present"}`,
                  description: pos.description,
                  skills: pos.skills,
                })),
              })),
            };
          },
        }),
      },
      maxSteps: 3,
    });

    console.log("✅ streamText completed, returning response...");
    return result.toDataStreamResponse();
  } catch (error) {
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
}
