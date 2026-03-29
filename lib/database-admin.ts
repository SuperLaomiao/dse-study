import { getDataAccessMode, getDatabaseConfigIssue } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { runPrismaDbPush } from "@/lib/prisma-cli";
import { seedDatabase } from "@/prisma/seed";

export interface DatabaseAdminStatus {
  mode: "demo" | "database";
  connectivity: "demo" | "connected" | "unreachable";
  schemaReady: boolean;
  seeded: boolean;
  summary: string;
  nextStep: string;
  issueCode:
    | "none"
    | "missing"
    | "unsupported"
    | "network"
    | "auth"
    | "database_missing"
    | "unknown";
  detail: string;
}

export async function getDatabaseAdminStatus(): Promise<DatabaseAdminStatus> {
  const configIssue = getDatabaseConfigIssue();

  if (configIssue === "missing") {
    return {
      mode: "demo",
      connectivity: "demo",
      schemaReady: false,
      seeded: false,
      summary: "DATABASE_URL is missing, so the app is serving demo data.",
      nextStep: "Add the Neon Postgres DATABASE_URL before trying schema bootstrap or seed.",
      issueCode: "missing",
      detail: "No database connection string is configured in the current runtime."
    };
  }

  if (configIssue === "unsupported") {
    return {
      mode: "demo",
      connectivity: "demo",
      schemaReady: false,
      seeded: false,
      summary: "DATABASE_URL uses an unsupported engine, so the app is staying in demo mode.",
      nextStep: "Replace the old connection string with a PostgreSQL URL such as the Neon connection string.",
      issueCode: "unsupported",
      detail: "The runtime is configured with a datasource Prisma does not recognize for this repo."
    };
  }

  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    const familyTable = (await prisma.$queryRawUnsafe(`
      SELECT tablename
      FROM pg_catalog.pg_tables
      WHERE schemaname = 'public' AND tablename = 'Family'
    `)) as unknown[];

    if (familyTable.length === 0) {
      return {
        mode: "database",
        connectivity: "connected",
        schemaReady: false,
        seeded: false,
        summary: "Neon Postgres is reachable, but the Prisma tables have not been created yet.",
        nextStep: "Run Bootstrap Schema first, then seed the demo family data.",
        issueCode: "none",
        detail: "The database accepted a query, but the Family table does not exist yet."
      };
    }

    const userCount = await prisma.user.count();

    return {
      mode: "database",
      connectivity: "connected",
      schemaReady: true,
      seeded: userCount > 0,
      summary:
        userCount > 0
          ? "Neon Postgres is reachable and seeded."
          : "Neon Postgres is reachable and the schema exists, but demo seed data is still missing.",
      nextStep: userCount > 0
        ? "Database is ready for the learner and admin flows."
        : "Run Seed Demo Data to populate the family, learner, and profile records.",
      issueCode: "none",
      detail:
        userCount > 0
          ? "The runtime can query the shared Neon Postgres instance."
          : "The schema exists, but the core user and learner records have not been inserted yet."
    };
  } catch (error) {
    console.error("database admin status check failed", error);
    const diagnosis = diagnoseDatabaseFailure(error);

    return {
      mode: "database",
      connectivity: "unreachable",
      schemaReady: false,
      seeded: false,
      summary: diagnosis.summary,
      nextStep: diagnosis.nextStep,
      issueCode: diagnosis.issueCode,
      detail: diagnosis.detail
    };
  }
}

function diagnoseDatabaseFailure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("can't reach database server")) {
    return {
      issueCode: "network" as const,
      summary: "Neon Postgres is configured, but the runtime cannot reach the database host yet.",
      nextStep: "Check the DATABASE_URL host, confirm the Neon project is awake, and verify the deployment can reach the public endpoint.",
      detail: message
    };
  }

  if (
    normalizedMessage.includes("access denied for user") ||
    normalizedMessage.includes("authentication failed") ||
    normalizedMessage.includes("password authentication failed")
  ) {
    return {
      issueCode: "auth" as const,
      summary: "The database rejected the current credentials.",
      nextStep: "Check the DATABASE_URL username and password, then verify the selected Neon role still has access.",
      detail: message
    };
  }

  if (normalizedMessage.includes("unknown database") || normalizedMessage.includes("database") && normalizedMessage.includes("does not exist")) {
    return {
      issueCode: "database_missing" as const,
      summary: "The server responded, but the configured database name does not exist yet.",
      nextStep: "Check that the database exists in Neon and that DATABASE_URL points at the correct database name.",
      detail: message
    };
  }

  return {
    issueCode: "unknown" as const,
    summary: "DATABASE_URL is set, but database startup checks are still failing.",
    nextStep: "Check the deployment logs for the exact Prisma error before retrying bootstrap or seed.",
    detail: message
  };
}

export async function runDatabaseBootstrap() {
  if (getDataAccessMode() === "demo") {
    return {
      status: "error" as const,
      message:
        getDatabaseConfigIssue() === "unsupported"
          ? "Replace DATABASE_URL with the Neon PostgreSQL URL before bootstrapping."
          : "Set DATABASE_URL before bootstrapping the schema."
    };
  }

  try {
    await runPrismaDbPush();

    return {
      status: "success" as const,
      message: "Schema bootstrap finished. You can run seed next."
    };
  } catch (error) {
    console.error("database bootstrap failed", error);

    return {
      status: "error" as const,
      message: "Schema bootstrap failed. Check the deployment logs for the Prisma error."
    };
  }
}

export async function runDatabaseSeed() {
  if (getDataAccessMode() === "demo") {
    return {
      status: "error" as const,
      message:
        getDatabaseConfigIssue() === "unsupported"
          ? "Replace DATABASE_URL with the Neon PostgreSQL URL before seeding."
          : "Set DATABASE_URL before seeding the database."
    };
  }

  try {
    await seedDatabase(prisma);

    return {
      status: "success" as const,
      message: "Demo family data seeded into Neon Postgres."
    };
  } catch (error) {
    console.error("database seed failed", error);

    return {
      status: "error" as const,
      message: "Seed failed. Bootstrap the schema first, then retry."
    };
  }
}
