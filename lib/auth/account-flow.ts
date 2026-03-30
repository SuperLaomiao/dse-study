import { pickLocale, type Locale } from "@/lib/i18n/config";
import { findDemoUserByCredentials, findDemoUserByEmail } from "@/lib/auth/session";

type ValidationResult = { ok: true } | { ok: false; message: string };

export function validateSignInInput(input: {
  email: string;
  password: string;
}, locale: Locale = "en"): ValidationResult {
  if (!input.email.trim()) {
    return { ok: false, message: pickLocale(locale, { zh: "请先填写邮箱。", en: "Email is required." }) };
  }

  if (!input.password.trim()) {
    return { ok: false, message: pickLocale(locale, { zh: "请先填写密码。", en: "Password is required." }) };
  }

  if (!findDemoUserByEmail(input.email)) {
    return {
      ok: false,
      message: pickLocale(locale, {
        zh: "请使用当前演示账号邮箱之一登录。",
        en: "Use one of the current demo emails to sign in."
      })
    };
  }

  if (!findDemoUserByCredentials(input.email, input.password)) {
    return {
      ok: false,
      message: pickLocale(locale, {
        zh: "邮箱或密码不正确。",
        en: "Email or password is incorrect."
      })
    };
  }

  return { ok: true };
}

export function validateCreateFamilyInput(input: {
  familyName: string;
  parentName: string;
  email: string;
  password: string;
}, locale: Locale = "en"): ValidationResult {
  if (!input.familyName.trim()) {
    return { ok: false, message: pickLocale(locale, { zh: "请先填写家庭名称。", en: "Family name is required." }) };
  }

  if (!input.parentName.trim()) {
    return { ok: false, message: pickLocale(locale, { zh: "请先填写家长名称。", en: "Parent name is required." }) };
  }

  if (!input.email.trim()) {
    return { ok: false, message: pickLocale(locale, { zh: "请先填写邮箱。", en: "Email is required." }) };
  }

  if (!input.password.trim()) {
    return { ok: false, message: pickLocale(locale, { zh: "请先填写密码。", en: "Password is required." }) };
  }

  return { ok: true };
}

export function validateJoinFamilyInput(input: {
  email: string;
  inviteCode: string;
}, locale: Locale = "en"): ValidationResult {
  if (!input.email.trim()) {
    return { ok: false, message: pickLocale(locale, { zh: "请先填写邮箱。", en: "Email is required." }) };
  }

  if (!input.inviteCode.trim()) {
    return { ok: false, message: pickLocale(locale, { zh: "请先填写邀请码。", en: "Invite code is required." }) };
  }

  if (input.inviteCode.trim().toUpperCase() !== "CHAN-FAMILY") {
    return {
      ok: false,
      message: pickLocale(locale, {
        zh: "这个邀请码不属于当前演示家庭。",
        en: "Invite code is not valid for the current demo family."
      })
    };
  }

  if (!findDemoUserByEmail(input.email)) {
    return {
      ok: false,
      message: pickLocale(locale, {
        zh: "请使用当前演示学习者邮箱之一加入家庭。",
        en: "Use one of the current demo learner emails to join the family."
      })
    };
  }

  return { ok: true };
}
