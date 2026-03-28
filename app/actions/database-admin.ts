"use server";

import { revalidatePath } from "next/cache";

import type { DatabaseActionState } from "@/lib/action-states";
import { runDatabaseBootstrap, runDatabaseSeed } from "@/lib/database-admin";

export async function bootstrapDatabaseAction(_previousState: DatabaseActionState) {
  const result = await runDatabaseBootstrap();

  revalidatePath("/admin/system");

  return result;
}

export async function seedDatabaseAction(_previousState: DatabaseActionState) {
  const result = await runDatabaseSeed();

  revalidatePath("/admin/system");

  return result;
}
