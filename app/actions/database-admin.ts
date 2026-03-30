"use server";

import { revalidatePath } from "next/cache";

import type { DatabaseActionState } from "@/lib/action-states";
import { getRequestLocale } from "@/lib/i18n/server";
import { runDatabaseBootstrap, runDatabaseSeed } from "@/lib/database-admin";

export async function bootstrapDatabaseAction(_previousState: DatabaseActionState) {
  const locale = await getRequestLocale();
  const result = await runDatabaseBootstrap(locale);

  revalidatePath("/admin/system");

  return result;
}

export async function seedDatabaseAction(_previousState: DatabaseActionState) {
  const locale = await getRequestLocale();
  const result = await runDatabaseSeed(locale);

  revalidatePath("/admin/system");

  return result;
}
