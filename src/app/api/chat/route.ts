import { google } from "@ai-sdk/google";
import {
  streamText,
  tool,
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  stepCountIs,
  UIMessageStreamWriter,
  smoothStream,
  generateId,
} from "ai";
import { z } from "zod";

import { USER } from "@/data/user";
import { EXPERIENCES } from "@/features/profile/data/experiences";
import { PROJECTS } from "@/features/profile/data/projects";
import { TECH_STACK } from "@/features/profile/data/tech-stack";
import { getAllPosts } from "@/data/blog";
import { personalContext } from "@/components/ai/context";
import { handleChatError } from "@/components/ai/error-handler";
import { prepareChatRequest } from "@/components/ai/chat-handler";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Get all posts for context
const allPosts = getAllPosts();

export async function POST(req: Request) {
  try {
    // Handle all validation, rate limiting, and setup in one place
    const chatPreparation = await prepareChatRequest(req);
    if (!chatPreparation.success) {
      return chatPreparation.response!;
    }

    const messages = chatPreparation.messages!;

    console.log("🚀 Creating UI message stream with Gemini model...");

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const result = streamText({
          model: google("gemini-2.5-flash"),
          system: personalContext,
          messages: convertToModelMessages(messages),
          stopWhen: stepCountIs(5),
          // experimental_transform: smoothStream({ chunking: "line" }),
          tools: {
            searchProjects: tool({
              description:
                "Search through projects based on technology or keyword",
              inputSchema: z.object({
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
              description:
                "Search through blog posts based on title or content",
              inputSchema: z.object({
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
              description:
                "Get information about technologies in the tech stack",
              inputSchema: z.object({
                category: z
                  .string()
                  .optional()
                  .describe(
                    "Filter by category (e.g., Framework, Library, etc.)"
                  ),
              }),
              execute: async ({ category }) => {
                const filteredTech = category
                  ? TECH_STACK.filter((tech) =>
                      tech.categories.includes(category)
                    )
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
              inputSchema: z.object({
                company: z
                  .string()
                  .optional()
                  .describe("Filter by company name"),
              }),
              execute: async ({ company }) => {
                const filteredExp = company
                  ? EXPERIENCES.filter((exp) =>
                      exp.companyName
                        .toLowerCase()
                        .includes(company.toLowerCase())
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
            generateCodeSnippet: tool({
              description:
                "Generate portfolio-related code snippets ONLY for technologies and concepts that exist in the portfolio's tech stack. Do not generate code for unrelated topics.",
              inputSchema: z.object({
                topic: z
                  .string()
                  .describe(
                    "MUST be a technology or concept from the portfolio tech stack (React, TypeScript, Next.js, etc.). Will reject topics not related to the portfolio."
                  ),
                language: z
                  .string()
                  .optional()
                  .describe(
                    "Preferred programming language from the portfolio stack"
                  ),
                complexity: z
                  .enum(["beginner", "intermediate", "advanced"])
                  .optional()
                  .describe(
                    "Complexity level of the snippet (default: intermediate)"
                  ),
              }),
              execute: async ({
                topic,
                language = "auto",
                complexity = "intermediate",
              }) => {
                // Validate topic is portfolio-related
                const portfolioTechnologies = TECH_STACK.map((tech) =>
                  tech.title.toLowerCase()
                );
                const portfolioSkills = [
                  ...USER.flipSentences,
                  ...PROJECTS.flatMap((p) => p.skills),
                ].map((s) => s.toLowerCase());
                const topicLower = topic.toLowerCase();

                // Check if topic is related to portfolio technologies
                const isPortfolioRelated =
                  portfolioTechnologies.some(
                    (tech) =>
                      topicLower.includes(tech.toLowerCase()) ||
                      tech.toLowerCase().includes(topicLower)
                  ) ||
                  portfolioSkills.some(
                    (skill) =>
                      topicLower.includes(skill.toLowerCase()) ||
                      skill.toLowerCase().includes(topicLower)
                  ) ||
                  [
                    "react",
                    "javascript",
                    "typescript",
                    "nextjs",
                    "next.js",
                    "node",
                    "css",
                    "html",
                    "web development",
                    "frontend",
                    "backend",
                    "component",
                    "hook",
                    "api",
                  ].some((keyword) => topicLower.includes(keyword));

                if (!isPortfolioRelated) {
                  return {
                    error: `Sorry, I can only provide code snippets for technologies and concepts related to ${USER.firstName}'s portfolio and tech stack. The topic "${topic}" is outside the scope of the portfolio. Please ask about: ${portfolioTechnologies.join(", ")}.`,
                  };
                }

                // Determine the best language based on the topic and portfolio tech stack
                const getLanguageForTopic = (
                  topic: string,
                  preferredLang?: string
                ) => {
                  if (preferredLang && preferredLang !== "auto")
                    return preferredLang;

                  const topicLower = topic.toLowerCase();

                  // Frontend/React related
                  if (
                    topicLower.includes("react") ||
                    topicLower.includes("jsx") ||
                    topicLower.includes("component")
                  )
                    return "javascript";
                  if (
                    topicLower.includes("typescript") ||
                    topicLower.includes("types")
                  )
                    return "typescript";
                  if (
                    topicLower.includes("css") ||
                    topicLower.includes("styling")
                  )
                    return "css";

                  // Backend related
                  if (
                    topicLower.includes("node") ||
                    topicLower.includes("express") ||
                    topicLower.includes("api")
                  )
                    return "javascript";
                  if (
                    topicLower.includes("python") ||
                    topicLower.includes("django") ||
                    topicLower.includes("flask")
                  )
                    return "python";

                  // Default to JavaScript for web development topics
                  return "javascript";
                };

                const selectedLanguage = getLanguageForTopic(topic, language);

                // Generate snippet guidelines
                const snippetGuidelines = `
PORTFOLIO CODE SNIPPET GUIDELINES:
1. Each snippet should be complete and runnable on its own
2. Include helpful comments explaining the code
3. Keep snippets concise (generally under 20 lines)
4. Use modern best practices relevant to ${USER.firstName}'s tech stack
5. Handle potential errors gracefully when applicable
6. Return meaningful output that demonstrates functionality
7. Focus on practical, real-world examples
8. Relate to technologies and concepts from the portfolio when possible
9. For web examples, use modern ES6+ syntax
10. Include console.log() or appropriate output methods

COMPLEXITY LEVELS:
- beginner: Basic concepts, simple examples
- intermediate: Practical examples with some advanced features
- advanced: Complex patterns, optimizations, architectural concepts

TOPIC: ${topic}
LANGUAGE: ${selectedLanguage}
COMPLEXITY: ${complexity}

Generate a practical code snippet that demonstrates ${topic} using ${selectedLanguage}, suitable for ${complexity} level.
Include a brief explanation of what the code does and how it relates to modern web development practices.
`;

                return {
                  snippet: {
                    topic,
                    language: selectedLanguage,
                    complexity,
                    guidelines: snippetGuidelines,
                    portfolioContext: `This snippet relates to ${USER.firstName}'s experience with ${TECH_STACK.map((tech) => tech.title).join(", ")} and modern web development practices.`,
                  },
                };
              },
            }),
          },
        });

        result.consumeStream();

        dataStream.merge(
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

    console.log("✅ UI message stream created, returning response...");
    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error) {
    return handleChatError(error);
  }
}
