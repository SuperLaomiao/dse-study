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
      nextStep: "Add the CloudBase MySQL DATABASE_URL before trying schema bootstrap or seed.",
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
      nextStep: "Replace the old connection string with a CloudBase MySQL mysql:// URL.",
      issueCode: "unsupported",
      detail: "The runtime is configured with a non-MySQL connection string, so Prisma stays on demo data."
    };
  }

  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    const familyTable = (await prisma.$queryRawUnsafe("SHOW TABLES LIKE 'Family'")) as unknown[];

    if (familyTable.length === 0) {
      return {
        mode: "database",
        connectivity: "connected",
        schemaReady: false,
        seeded: false,
        summary: "CloudBase MySQL is reachable, but the Prisma tables have not been created yet.",
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
          ? "CloudBase MySQL is reachable and seeded."
          : "CloudBase MySQL is reachable and the schema exists, but demo seed data is still missing.",
      nextStep: userCount > 0
        ? "Database is ready for the learner and admin flows."
        : "Run Seed Demo Data to populate the family, learner, and profile records.",
      issueCode: "none",
      detail:
        userCount > 0
          ? "CloudBase runtime can query the shared MySQL instance."
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
      summary: "CloudBase MySQL is configured, but the runtime cannot reach the network path to the database yet.",
      nextStep: "Check CloudBase network access, confirm the MySQL instance is awake, and verify the service can reach the private address.",
      detail: message
    };
  }

  if (normalizedMessage.includes("access denied for user")) {
    return {
      issueCode: "auth" as const,
      summary: "CloudBase MySQL rejected the current database credentials.",
      nextStep: "Check the DATABASE_URL username and password, then verify the account has access from the configured host.",
      detail: message
    };
  }

  if (normalizedMessage.includes("unknown database")) {
    return {
      issueCode: "database_missing" as const,
      summary: "CloudBase MySQL responded, but the configured database name does not exist yet.",
      nextStep: "Check that the database exists in CloudBase and that DATABASE_URL points at the correct database name.",
      detail: message
    };
  }

  return {
    issueCode: "unknown" as const,
    summary: "DATABASE_URL is set, but CloudBase MySQL is still failing during startup checks.",
    nextStep: "Check the CloudBase runtime logs for the exact Prisma error before retrying bootstrap or seed.",
    detail: message
  };
}

export async function runDatabaseBootstrap() {
  if (getDataAccessMode() === "demo") {
    return {
      status: "error" as const,
      message:
        getDatabaseConfigIssue() === "unsupported"
          ? "Replace DATABASE_URL with a CloudBase MySQL mysql:// URL before bootstrapping."
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
      message: "Schema bootstrap failed. Check CloudBase runtime logs for the Prisma error."
    };
  }
}

export async function runDatabaseSeed() {
  if (getDataAccessMode() === "demo") {
    return {
      status: "error" as const,
      message:
        getDatabaseConfigIssue() === "unsupported"
          ? "Replace DATABASE_URL with a CloudBase MySQL mysql:// URL before seeding."
          : "Set DATABASE_URL before seeding the database."
    };
  }

  try {
    await seedDatabase(prisma);

    return {
      status: "success" as const,
      message: "Demo family data seeded into CloudBase MySQL."
    };
  } catch (error) {
    console.error("database seed failed", error);

    return {
      status: "error" as const,
      message: "Seed failed. Bootstrap the schema first, then retry."
    };
  }
}
