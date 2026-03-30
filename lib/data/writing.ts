import { getDataAccessMode } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import type { WritingPrompt } from "@prisma/client";
import { writingPromptCatalog } from "@/lib/writing-prompt-catalog";

const prisma = new PrismaClient();

const demoWritingPrompts: WritingPrompt[] = writingPromptCatalog.map((prompt) => ({
  ...prompt,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export function getDemoWritingPrompts(): WritingPrompt[] {
  return demoWritingPrompts;
}

export function getDemoWritingPrompt(id: string): WritingPrompt | null {
  return demoWritingPrompts.find(p => p.id === id) || null;
}

export async function getAllWritingPrompts(): Promise<WritingPrompt[]> {
  if (getDataAccessMode() === "demo") {
    return getDemoWritingPrompts();
  }

  try {
    return await prisma.writingPrompt.findMany({
      orderBy: [
        { part: "asc" },
        { difficultyLevel: "asc" }
      ]
    });
  } catch (error) {
    console.error("Error getting all writing prompts, falling back to demo", error);
    return getDemoWritingPrompts();
  }
}

export async function getWritingPromptById(id: string): Promise<WritingPrompt | null> {
  if (getDataAccessMode() === "demo") {
    return getDemoWritingPrompt(id);
  }

  try {
    return await prisma.writingPrompt.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error("Error getting writing prompt by id", error);
    return getDemoWritingPrompt(id);
  }
}

export async function seedInitialWritingPrompts() {
  if (getDataAccessMode() === "demo") {
    return;
  }

  try {
    const existing = await prisma.writingPrompt.count();
    if (existing > 0) {
      console.log("Writing prompts already seeded");
      return;
    }

    await prisma.writingPrompt.createMany({
      data: writingPromptCatalog
    });

    console.log("Successfully seeded initial writing prompts");
  } catch (error) {
    console.error("Error seeding initial writing prompts", error);
  }
}
