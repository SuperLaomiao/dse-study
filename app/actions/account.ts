"use server";

import { redirect } from "next/navigation";

import type { AccountActionState } from "@/lib/action-states";
import {
  validateCreateFamilyInput,
  validateJoinFamilyInput,
  validateSignInInput
} from "@/lib/auth/account-flow";
import { hashPassword } from "@/lib/auth/password";
import { getPostSignInRedirect } from "@/lib/auth/session";
import { getCurrentSession, setSessionCookie } from "@/lib/auth/server";
import { getDataAccessMode } from "@/lib/db";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";
import {
  createFamilySetup,
  verifyUserCredentials,
  joinFamilyMembership
} from "@/lib/repositories/account-repository";

export async function signInWithEmailAction(
  _previousState: AccountActionState,
  formData: FormData
) {
  const locale = await getRequestLocale();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const validation =
    getDataAccessMode() === "database"
      ? !email.trim()
        ? { ok: false as const, message: pickLocale(locale, { zh: "请先填写邮箱。", en: "Email is required." }) }
        : !password.trim()
          ? { ok: false as const, message: pickLocale(locale, { zh: "请先填写密码。", en: "Password is required." }) }
          : { ok: true as const }
      : validateSignInInput({ email, password }, locale);

  if (!validation.ok) {
    return {
      status: "error",
      message: validation.message
    } satisfies AccountActionState;
  }

  const user = await verifyUserCredentials({ email, password });

  if (!user) {
    return {
      status: "error",
      message:
        getDataAccessMode() === "database"
          ? pickLocale(locale, { zh: "邮箱或密码不正确。", en: "Email or password is incorrect." })
          : pickLocale(locale, {
              zh: "请使用当前演示账号邮箱之一登录。",
              en: "Use one of the current demo emails to sign in."
            })
    } satisfies AccountActionState;
  }

  await setSessionCookie(user);
  redirect(getPostSignInRedirect(user.role));
}

export async function createFamilyAction(
  _previousState: AccountActionState,
  formData: FormData
) {
  const locale = await getRequestLocale();
  const familyName = String(formData.get("familyName") ?? "");
  const parentName = String(formData.get("parentName") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const validation = validateCreateFamilyInput({ familyName, parentName, email, password }, locale);

  if (!validation.ok) {
    return {
      status: "error",
      message: validation.message
    } satisfies AccountActionState;
  }

  if (getDataAccessMode() !== "database") {
    return {
      status: "success",
      message: pickLocale(locale, {
        zh: `${familyName} 已通过演示校验，下一步会接上真实邀请码持久化。`,
        en: `${familyName} is ready for demo setup. Invite flow will be persisted in the next slice.`
      })
    } satisfies AccountActionState;
  }

  try {
    const session = await getCurrentSession();
    const passwordHash = await hashPassword(password);
    await createFamilySetup({
      familyName,
      parentName,
      email,
      passwordHash,
      session
    });

    return {
      status: "success",
      message: pickLocale(locale, {
        zh: `${familyName} 已保存，演示学习者邀请码已经可以使用。`,
        en: `${familyName} saved. Demo learner invites are ready to join.`
      })
    } satisfies AccountActionState;
  } catch (error) {
    console.error("create family action failed", error);
    return {
      status: "error",
      message: pickLocale(locale, {
        zh: "当前暂时无法保存家庭信息。",
        en: "Unable to save the family right now."
      })
    } satisfies AccountActionState;
  }
}

export async function joinFamilyAction(
  _previousState: AccountActionState,
  formData: FormData
) {
  const locale = await getRequestLocale();
  const email = String(formData.get("email") ?? "");
  const inviteCode = String(formData.get("inviteCode") ?? "");
  const validation =
    getDataAccessMode() === "database"
      ? !email.trim()
        ? { ok: false as const, message: pickLocale(locale, { zh: "请先填写邮箱。", en: "Email is required." }) }
        : !inviteCode.trim()
          ? { ok: false as const, message: pickLocale(locale, { zh: "请先填写邀请码。", en: "Invite code is required." }) }
          : { ok: true as const }
      : validateJoinFamilyInput({ email, inviteCode }, locale);

  if (!validation.ok) {
    return {
      status: "error",
      message: validation.message
    } satisfies AccountActionState;
  }

  if (getDataAccessMode() !== "database") {
    return {
      status: "success",
      message: pickLocale(locale, {
        zh: "演示加入成功，下一步会接上真实邀请持久化。",
        en: "Demo join successful. Real invitation persistence comes next."
      })
    } satisfies AccountActionState;
  }

  try {
    const result = await joinFamilyMembership({
      email,
      inviteCode
    });

    if (!result) {
      return {
        status: "error",
        message: pickLocale(locale, {
          zh: "没有匹配到这个邀请码或学习者邮箱。",
          en: "Invite code or learner email could not be matched."
        })
      } satisfies AccountActionState;
    }

    return {
      status: "success",
      message: pickLocale(locale, {
        zh: `已加入 ${result.familyName}，学习者权限现已启用。`,
        en: `Joined ${result.familyName}. Your learner access is now active.`
      })
    } satisfies AccountActionState;
  } catch (error) {
    console.error("join family action failed", error);
    return {
      status: "error",
      message: pickLocale(locale, {
        zh: "当前暂时无法加入家庭。",
        en: "Unable to join the family right now."
      })
    } satisfies AccountActionState;
  }
}
