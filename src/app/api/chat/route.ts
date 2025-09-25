// app/api/chat/route.ts
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { PROFILE, LINKS } from "../../../data/profile";
import { chunkProfile, topK } from "../../../lib/rag";

export const runtime = "edge";

const docs = chunkProfile(PROFILE);

const linkSchema = z.object({
  which: z.enum(["resume", "linkedin", "github", "portfolio"]),
});
type LinkInput = z.infer<typeof linkSchema>;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const last = messages?.[messages.length - 1]?.content ?? "";

  const context = topK(last, docs, 5)
    .map((d) => `- (${d.id}) ${d.content}`)
    .join("\n");

  const system = `You are an intelligent, friendly, and professional virtual assistant for Sumedh Badnore’s personal portfolio website. Your role is to help visitors learn about Sumedh’s background, skills, education, and professional experience, and to provide accurate information in a concise and approachable tone.
Interaction Guidelines
* Provide professional yet approachable answers to questions about Sumedh’s work history, technical expertise, academic achievements, and personal projects.
* Share contact details when requested; Email: sumedhbadnore2801@gmail.com and LinkedIn: linkedin.com/in/sumedh-badnore and Mobile No: +12015265735.
* Respond concisely but offer relevant context, metrics, and accomplishments where helpful (e.g., latency reductions, uptime gains, CI/CD improvements).
* If asked about career interests, highlight Sumedh’s passion for building scalable cloud-native systems, distributed microservices, and high-performance applications that serve enterprise and government clients.
Tone & Style, Maintain a professional, friendly, and concise voice that reflects Sumedh’s technical expertise and collaborative nature.

[PROFILE CONTEXT]
${context}

[LINK HINTS]
Resume: ${LINKS.resumeUrl}
LinkedIn: ${LINKS.linkedin}
GitHub: ${LINKS.github}
Portfolio: ${LINKS.portfolio}
`;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system,
    messages,
    tools: {
      get_links: {
        description: "Return canonical links like resume, LinkedIn, GitHub, or portfolio.",
        inputSchema: linkSchema,
        async execute({ which }: LinkInput) {
          const MAP = {
            resume: LINKS.resumeUrl,
            linkedin: LINKS.linkedin,
            github: LINKS.github,
            portfolio: LINKS.portfolio,
          } as const;
          return { url: MAP[which] };
        },
      },
    },
    maxOutputTokens: 600,
    temperature: 0.3,
  });
  return result.toTextStreamResponse();
}


