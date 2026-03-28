import { getDataAccessMode } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { runPrismaDbPush } from "@/lib/prisma-cli";
import { seedDatabase } from "@/prisma/seed";

export interface DatabaseAdminStatus {
  mode: "demo" | "database";
  connectivity: "demo" | "connected" | "unreachable";
  schemaReady: boolean;
  seeded: boolean;
  summary: string;
}

export async function getDatabaseAdminStatus(): Promise<DatabaseAdminStatus> {
  if (getDataAccessMode() === "demo") {
    return {
      mode: "demo",
      connectivity: "demo",
      schemaReady: false,
      seeded: false,
      summary: "DATABASE_URL is missing, so the app is serving demo data."
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
        summary: "CloudBase MySQL is reachable, but the Prisma tables have not been created yet."
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
          : "CloudBase MySQL is reachable and the schema exists, but demo seed data is still missing."
    };
  } catch (error) {
    console.error("database admin status check failed", error);

    return {
      mode: "database",
      connectivity: "unreachable",
      schemaReady: false,
      seeded: false,
      summary: "DATABASE_URL is set, but the runtime cannot reach CloudBase MySQL yet."
    };
  }
}

export async function runDatabaseBootstrap() {
  if (getDataAccessMode() === "demo") {
    return {
      status: "error" as const,
      message: "Set DATABASE_URL before bootstrapping the schema."
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
      message: "Set DATABASE_URL before seeding the database."
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
