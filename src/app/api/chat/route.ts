import { google } from "@ai-sdk/google";
import {
  streamText,
  tool,
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  stepCountIs,
  UIMessageStreamWriter,
} from "ai";
import { z } from "zod";

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
      execute: ({ writer }: { writer: UIMessageStreamWriter }) => {
        const result = streamText({
          model: google("gemini-2.5-flash"),
          system: personalContext,
          messages: convertToModelMessages(messages),
          stopWhen: stepCountIs(5),
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
          },
        });

        result.consumeStream();

        writer.merge(result.toUIMessageStream());
      },
    });

    console.log("✅ UI message stream created, returning response...");
    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error) {
    return handleChatError(error);
  }
}
