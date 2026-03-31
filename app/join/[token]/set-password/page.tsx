
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { resolveLocale, pickLocale, type Locale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, CheckCircle } from "lucide-react";

export default function SetPasswordForInvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [locale, setLocale] = useState<Locale>("zh");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [familyName, setFamilyName] = useState<string>("");

  useEffect(() => {
    if (typeof document === "undefined") return;
    setLocale(resolveLocale(document.documentElement.lang.split("-")[0]));
  }, []);

  useEffect(() => {
    async function loadInvite() {
      try {
        const res = await fetch(`/api/invites/${token}`);
        if (!res.ok) {
          setError(pickLocale(locale, {
            zh: "邀请链接不存在或已失效",
            en: "Invite link not found or expired"
          }));
          setLoading(false);
          return;
        }
        const data = await res.json();
        setInviteEmail(data.email);
        setFamilyName(data.familyName || "");
      } catch {
        setError(pickLocale(locale, {
          zh: "加载失败，请刷新重试",
          en: "Failed to load invite, please refresh"
        }));
      } finally {
        setLoading(false);
      }
    }
    loadInvite();
  }, [token, locale]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    if (password.length < 6) {
      setError(pickLocale(locale, {
        zh: "密码至少需要6个字符",
        en: "Password must be at least 6 characters"
      }));
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(pickLocale(locale, {
        zh: "两次输入的密码不一致",
        en: "Passwords do not match"
      }));
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/invites/${token}/accept-with-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      // Success - redirect to home
      router.push(data.redirectTo || "/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>{pickLocale(locale, { zh: "加载中...", en: "Loading..." })}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                {pickLocale(locale, { zh: "出错了", en: "Error" })}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-muted-foreground">{error}</p></CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/")}>
              {pickLocale(locale, { zh: "返回首页", en: "Back to Home" })}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            {pickLocale(locale, { zh: "设置密码", en: "Set Password" })}
          </CardTitle>
          <CardDescription>
            {familyName
              ? pickLocale(locale, {
                  zh: `你正在加入 ${familyName}，设置密码完成注册`,
                  en: `You're joining ${familyName}, set your password to complete sign up`
                })
              : pickLocale(locale, {
                  zh: "设置密码完成注册",
                  en: "Set your password to complete sign up"
                })
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-3">
            <div className="text-sm text-muted-foreground">{pickLocale(locale, { zh: "邮箱", en: "Email" })}</div>
            <div className="font-medium">{inviteEmail}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {pickLocale(locale, { zh: "密码", en: "Password" })}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={pickLocale(locale, { zh: "请设置密码", en: "Set your password" })}
              className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {pickLocale(locale, { zh: "确认密码", en: "Confirm Password" })}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={pickLocale(locale, { zh: "再次输入密码", en: "Confirm your password" })}
              className="w-full rounded-2xl border border-[rgba(35,64,43,0.12)] bg-[var(--cream)] px-4 py-3 text-sm"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? pickLocale(locale, { zh: "处理中...", en: "Creating..." })
              : pickLocale(locale, { zh: "完成注册并加入", en: "Complete & Join" })
            }
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
