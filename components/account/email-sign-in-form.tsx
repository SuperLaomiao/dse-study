import { pickLocale, type Locale } from "@/lib/i18n/config";

export default function EmailSignInForm({
  error,
  locale
}: {
  error?: string;
  locale: Locale;
}) {
  return (
    <form
      action="/api/account/sign-in"
      method="post"
      className="rounded-[24px] border border-[rgba(35,64,43,0.08)] bg-[rgba(255,255,255,0.92)] p-4 shadow-[0_16px_36px_rgba(66,51,27,0.06)]"
    >
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {pickLocale(locale, { zh: "邮箱", en: "Email" })}
        </span>
        <input
          type="email"
          name="email"
          placeholder="mom@example.com"
          className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[rgba(88,104,87,0.68)] focus:border-[rgba(35,64,43,0.28)] focus:bg-white"
        />
      </label>
      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-[var(--foreground)]">
          {pickLocale(locale, { zh: "密码", en: "Password" })}
        </span>
        <input
          type="password"
          name="password"
          placeholder="demo-admin-pass"
          className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[rgba(88,104,87,0.68)] focus:border-[rgba(35,64,43,0.28)] focus:bg-white"
        />
      </label>
      <div className="mt-4">
        <button
          type="submit"
          className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-[var(--cream)] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[var(--brand-strong)]"
        >
          {pickLocale(locale, { zh: "登录", en: "Sign In" })}
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
        {pickLocale(locale, {
          zh: "演示账号：`mom@example.com / demo-admin-pass`、`brother@example.com / demo-brother-pass`、`sister@example.com / demo-sister-pass`",
          en: "Demo credentials: `mom@example.com / demo-admin-pass`, `brother@example.com / demo-brother-pass`, `sister@example.com / demo-sister-pass`"
        })}
      </p>
      {error ? (
        <p className="mt-3 rounded-2xl border border-[rgba(159,58,40,0.12)] bg-[rgba(255,238,229,0.9)] px-3 py-2 text-sm text-[#9f3a28]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
