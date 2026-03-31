"use server";

import { NextResponse } from "next/server";
import { getDataAccessMode, getDatabaseConfigIssue } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export async function GET() {
  const mode = getDataAccessMode();
  const configIssue = getDatabaseConfigIssue();

  let databaseOk = false;
  let databaseError: string | null = null;

  if (mode === "database" && !configIssue) {
    try {
      // Test connection with a simple query
      await prisma.$queryRaw`SELECT 1`;
      databaseOk = true;
    } catch (error) {
      databaseError = error instanceof Error ? error.message : "Unknown error";
      databaseOk = false;
    }
  }

  const response = {
    status: databaseOk ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    app: "dse-study",
    mode,
    database: {
      configured: mode === "database",
      configIssue,
      connected: databaseOk,
      error: databaseError,
    },
    environment: {
      nodeEnv: env.NODE_ENV,
      hasOpenAIKey: !!env.OPENAI_API_KEY,
    },
  };

  const httpStatus = databaseOk ? 200 : 503;
  return NextResponse.json(response, { status: httpStatus });
}
