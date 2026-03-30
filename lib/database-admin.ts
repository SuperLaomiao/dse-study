import { getDataAccessMode, getDatabaseConfigIssue } from "@/lib/db";
import type { Locale } from "@/lib/i18n/config";
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

export async function getDatabaseAdminStatus(locale: Locale = "en"): Promise<DatabaseAdminStatus> {
  const configIssue = getDatabaseConfigIssue();

  if (configIssue === "missing") {
    return {
      mode: "demo",
      connectivity: "demo",
      schemaReady: false,
      seeded: false,
      summary:
        locale === "zh"
          ? "当前缺少 DATABASE_URL，所以应用仍在提供演示数据。"
          : "DATABASE_URL is missing, so the app is serving demo data.",
      nextStep:
        locale === "zh"
          ? "先补上 Neon Postgres 的 DATABASE_URL，再尝试初始化 schema 或写入种子数据。"
          : "Add the Neon Postgres DATABASE_URL before trying schema bootstrap or seed.",
      issueCode: "missing",
      detail:
        locale === "zh"
          ? "当前运行环境里还没有配置数据库连接字符串。"
          : "No database connection string is configured in the current runtime."
    };
  }

  if (configIssue === "unsupported") {
    return {
      mode: "demo",
      connectivity: "demo",
      schemaReady: false,
      seeded: false,
      summary:
        locale === "zh"
          ? "DATABASE_URL 使用了当前仓库不支持的引擎，因此系统继续停留在演示模式。"
          : "DATABASE_URL uses an unsupported engine, so the app is staying in demo mode.",
      nextStep:
        locale === "zh"
          ? "请把旧连接字符串替换为 PostgreSQL 地址，例如 Neon 提供的连接串。"
          : "Replace the old connection string with a PostgreSQL URL such as the Neon connection string.",
      issueCode: "unsupported",
      detail:
        locale === "zh"
          ? "当前运行时配置的数据源并不是这个仓库里 Prisma 可识别的类型。"
          : "The runtime is configured with a datasource Prisma does not recognize for this repo."
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
        summary:
          locale === "zh"
            ? "Neon Postgres 已可连通，但 Prisma 表结构还没有创建。"
            : "Neon Postgres is reachable, but the Prisma tables have not been created yet.",
        nextStep:
          locale === "zh"
            ? "先执行初始化 schema，再写入演示家庭数据。"
            : "Run Bootstrap Schema first, then seed the demo family data.",
        issueCode: "none",
        detail:
          locale === "zh"
            ? "数据库已经能响应查询，但 `Family` 表目前还不存在。"
            : "The database accepted a query, but the Family table does not exist yet."
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
          ? locale === "zh"
            ? "Neon Postgres 已可连通，且种子数据已就绪。"
            : "Neon Postgres is reachable and seeded."
          : locale === "zh"
            ? "Neon Postgres 已可连通，schema 也存在，但演示种子数据仍未写入。"
            : "Neon Postgres is reachable and the schema exists, but demo seed data is still missing.",
      nextStep: userCount > 0
        ? locale === "zh"
          ? "数据库已经可以支撑学习者与管理端流程。"
          : "Database is ready for the learner and admin flows."
        : locale === "zh"
          ? "执行写入种子数据，补齐家庭、学习者与档案记录。"
          : "Run Seed Demo Data to populate the family, learner, and profile records.",
      issueCode: "none",
      detail:
        userCount > 0
          ? locale === "zh"
            ? "当前运行时已经能够正常查询共享的 Neon Postgres 实例。"
            : "The runtime can query the shared Neon Postgres instance."
          : locale === "zh"
            ? "schema 已存在，但核心用户与学习者记录还没有写入。"
            : "The schema exists, but the core user and learner records have not been inserted yet."
    };
  } catch (error) {
    console.error("database admin status check failed", error);
    const diagnosis = diagnoseDatabaseFailure(error, locale);

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

function diagnoseDatabaseFailure(error: unknown, locale: Locale) {
  const message = error instanceof Error ? error.message : String(error);
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("can't reach database server")) {
    return {
      issueCode: "network" as const,
      summary:
        locale === "zh"
          ? "Neon Postgres 已配置，但当前运行时还连不到数据库主机。"
          : "Neon Postgres is configured, but the runtime cannot reach the database host yet.",
      nextStep:
        locale === "zh"
          ? "检查 DATABASE_URL 的主机地址，确认 Neon 项目已唤醒，并验证部署环境可访问公网端点。"
          : "Check the DATABASE_URL host, confirm the Neon project is awake, and verify the deployment can reach the public endpoint.",
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
      summary:
        locale === "zh"
          ? "数据库拒绝了当前凭据。"
          : "The database rejected the current credentials.",
      nextStep:
        locale === "zh"
          ? "检查 DATABASE_URL 中的用户名和密码，并确认所选 Neon 角色仍有访问权限。"
          : "Check the DATABASE_URL username and password, then verify the selected Neon role still has access.",
      detail: message
    };
  }

  if (normalizedMessage.includes("unknown database") || normalizedMessage.includes("database") && normalizedMessage.includes("does not exist")) {
    return {
      issueCode: "database_missing" as const,
      summary:
        locale === "zh"
          ? "服务器有响应，但当前配置的数据库名称还不存在。"
          : "The server responded, but the configured database name does not exist yet.",
      nextStep:
        locale === "zh"
          ? "确认 Neon 中已创建该数据库，并检查 DATABASE_URL 是否指向正确的数据库名。"
          : "Check that the database exists in Neon and that DATABASE_URL points at the correct database name.",
      detail: message
    };
  }

  return {
    issueCode: "unknown" as const,
    summary:
      locale === "zh"
        ? "DATABASE_URL 已配置，但数据库启动检查仍然失败。"
        : "DATABASE_URL is set, but database startup checks are still failing.",
    nextStep:
      locale === "zh"
        ? "重试初始化或写入数据前，请先查看部署日志里的 Prisma 具体报错。"
        : "Check the deployment logs for the exact Prisma error before retrying bootstrap or seed.",
    detail: message
  };
}

export async function runDatabaseBootstrap(locale: Locale = "en") {
  if (getDataAccessMode() === "demo") {
    return {
      status: "error" as const,
      message:
        getDatabaseConfigIssue() === "unsupported"
          ? locale === "zh"
            ? "初始化前请先把 DATABASE_URL 替换为 Neon 的 PostgreSQL 连接串。"
            : "Replace DATABASE_URL with the Neon PostgreSQL URL before bootstrapping."
          : locale === "zh"
            ? "初始化 schema 前请先设置 DATABASE_URL。"
            : "Set DATABASE_URL before bootstrapping the schema."
    };
  }

  try {
    await runPrismaDbPush();

    return {
      status: "success" as const,
      message:
        locale === "zh"
          ? "Schema 初始化完成，下一步可以写入种子数据。"
          : "Schema bootstrap finished. You can run seed next."
    };
  } catch (error) {
    console.error("database bootstrap failed", error);

    return {
      status: "error" as const,
      message:
        locale === "zh"
          ? "Schema 初始化失败，请到部署日志里查看 Prisma 报错。"
          : "Schema bootstrap failed. Check the deployment logs for the Prisma error."
    };
  }
}

export async function runDatabaseSeed(locale: Locale = "en") {
  if (getDataAccessMode() === "demo") {
    return {
      status: "error" as const,
      message:
        getDatabaseConfigIssue() === "unsupported"
          ? locale === "zh"
            ? "写入种子数据前请先把 DATABASE_URL 替换为 Neon 的 PostgreSQL 连接串。"
            : "Replace DATABASE_URL with the Neon PostgreSQL URL before seeding."
          : locale === "zh"
            ? "写入数据库前请先设置 DATABASE_URL。"
            : "Set DATABASE_URL before seeding the database."
    };
  }

  try {
    await seedDatabase();

    return {
      status: "success" as const,
      message:
        locale === "zh"
          ? "核心词汇数据已经写入数据库。"
          : "Core vocabulary data seeded into database."
    };
  } catch (error) {
    console.error("database seed failed", error);

    return {
      status: "error" as const,
      message:
        locale === "zh"
          ? "写入种子数据失败，请先初始化 schema 后再重试。"
          : "Seed failed. Bootstrap the schema first, then retry."
    };
  }
}
