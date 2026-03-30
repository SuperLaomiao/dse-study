import EmailSignInForm from "@/components/account/email-sign-in-form";
import PlaceholderPage from "@/components/placeholder-page";
import { redirectIfSignedIn } from "@/lib/auth/server";
import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function SignInPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await redirectIfSignedIn();
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams?.error;
  const locale = await getRequestLocale();

  return (
    <PlaceholderPage
      locale={locale}
      role="public"
      title={pickLocale(locale, { zh: "登录", en: "Sign In" })}
      description={pickLocale(locale, {
        zh: "使用演示邮箱，直接进入对应的学习者或管理员体验。",
        en: "Use a demo email to enter the right learner or admin experience."
      })}
      sections={[
        {
          title: pickLocale(locale, { zh: "从这里开始", en: "Start here" }),
          content: (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-muted)]">
                {pickLocale(locale, {
                  zh: "选择进入演示或 onboarding 流程的最快路径。",
                  en: "Choose the fastest route into the demo or onboarding flow."
                })}
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                <RouteCard
                  title={pickLocale(locale, { zh: "创建家庭", en: "Create a Family" })}
                  href="/family/create"
                  description={pickLocale(locale, {
                    zh: "先完成家长端设置，家庭空间准备好后再邀请学习者。",
                    en: "Start the parent setup flow and invite learners after the family shell is ready."
                  })}
                />
                <RouteCard
                  title={pickLocale(locale, { zh: "加入家庭", en: "Join a Family" })}
                  href="/family/join"
                  description={pickLocale(locale, {
                    zh: "用邀请码让学习者或兄弟姐妹加入已存在的家庭设置。",
                    en: "Use the invite code flow for a learner or sibling joining an existing setup."
                  })}
                />
                <RouteCard
                  title={pickLocale(locale, { zh: "预览学习者首页", en: "Preview Learner Home" })}
                  href="/home"
                  description={pickLocale(locale, {
                    zh: "如果你只是想先看看学习界面，可以直接进入学习者端。",
                    en: "Jump straight into the learner-side experience if you only want to inspect the study UI."
                  })}
                />
              </div>
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "邮箱登录", en: "Email sign-in" }),
          content: (
            <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.9fr)]">
              <div className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">
                  {pickLocale(locale, { zh: "演示入口", en: "Demo access" })}
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-muted)]">
                  <li>{pickLocale(locale, { zh: "`mom@example.com / demo-admin-pass` 会进入管理员看板与家庭控制台。", en: "`mom@example.com / demo-admin-pass` opens the admin dashboard and family controls." })}</li>
                  <li>{pickLocale(locale, { zh: "`brother@example.com / demo-brother-pass` 会进入哥哥的学习路径与 DSE 练习流程。", en: "`brother@example.com / demo-brother-pass` lands in the older learner path and DSE practice flow." })}</li>
                  <li>{pickLocale(locale, { zh: "`sister@example.com / demo-sister-pass` 会进入妹妹的学习路径，基线节奏更轻。", en: "`sister@example.com / demo-sister-pass` lands in the younger learner path with lighter baseline pacing." })}</li>
                </ul>
              </div>
              <EmailSignInForm error={error} locale={locale} />
            </div>
          )
        },
        {
          title: pickLocale(locale, { zh: "登录后会发生什么", en: "After sign-in" }),
          content: (
            <div className="grid gap-3 md:grid-cols-3">
              <StatusHint
                title={pickLocale(locale, { zh: "管理员路径", en: "Admin path" })}
                description={pickLocale(locale, {
                  zh: "家庭管理员会进入家庭总览、提醒与数据库系统工具。",
                  en: "Family admins go to the household overview, alerts, and database system tools."
                })}
              />
              <StatusHint
                title={pickLocale(locale, { zh: "学习者路径", en: "Learner path" })}
                description={pickLocale(locale, {
                  zh: "学习者会直接进入首页、练习、进度和复盘，不会接触管理员界面。",
                  en: "Learners drop into home, practice, progress, and review without touching admin screens."
                })}
              />
              <StatusHint
                title={pickLocale(locale, { zh: "手动测试", en: "Manual testing" })}
                description={pickLocale(locale, {
                  zh: "如果你想测试 onboarding，而不是快速演示登录，就使用上面的创建/加入家庭链接。",
                  en: "Use the family create/join links above when you want to test onboarding instead of the fast demo sign-in."
                })}
              />
            </div>
          )
        }
      ]}
    />
  );
}

function RouteCard({
  title,
  href,
  description
}: {
  title: string;
  href: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="rounded-[24px] border border-[rgba(114,95,63,0.08)] bg-[rgba(255,255,255,0.88)] p-4 shadow-[0_12px_30px_rgba(66,51,27,0.05)] transition hover:-translate-y-[1px] hover:border-[rgba(35,64,43,0.18)] hover:bg-white"
    >
      <p className="text-base font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
    </a>
  );
}

function StatusHint({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-[rgba(114,95,63,0.08)] bg-[var(--surface-soft)] p-4">
      <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
    </div>
  );
}
