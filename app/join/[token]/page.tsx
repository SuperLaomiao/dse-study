"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { pickLocale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";
import { getCurrentSession } from "@/lib/auth/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface InviteData {
  email: string;
  role: string;
  familyName?: string;
  inviterName?: string;
  expiresAt: string;
  isValid: boolean;
  isExpired: boolean;
  isAccepted: boolean;
}

export default function JoinInvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [success, setSuccess] = useState(false);

  // We can't get server-side props in client component, so we need to detect locale differently
  // For simplicity, we'll use browser language preference
  const locale: "en" | "zh" = typeof navigator !== "undefined" && navigator.language.startsWith("zh") ? "zh" : "en";

  useEffect(() => {
    async function loadInvite() {
      try {
        // Check if user is already signed in by checking if we can get session
        // This is done via a simple API call or we just let the accept handle it
        const response = await fetch(`/api/invites/${token}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError(pickLocale(locale, {
              zh: "邀请链接不存在或已失效",
              en: "Invite link not found or has been revoked"
            }));
          } else {
            setError(pickLocale(locale, {
              zh: "加载邀请信息失败，请刷新页面重试",
              en: "Failed to load invite information, please refresh and try again"
            }));
          }
          return;
        }

        const data = await response.json();
        setInvite(data);

        // Check if user is signed in
        // We'll just attempt accept and see if we get 401
        // This is simpler than checking session here
      } catch (err) {
        setError(pickLocale(locale, {
          zh: "网络错误，请检查连接后重试",
          en: "Network error, please check your connection and try again"
        }));
      } finally {
        setLoading(false);
      }
    }

    loadInvite();
  }, [token, locale]);

  const handleAccept = async () => {
    setAccepting(true);
    setError(null);

    try {
      const response = await fetch(`/api/invites/${token}/accept`, {
        method: "POST"
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Not signed in, redirect to sign in
          router.push(`/sign-in?redirect=/join/${token}`);
          return;
        }
        throw new Error(data.error);
      }

      setSuccess(true);
      // Redirect after short delay
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>
              {pickLocale(locale, { zh: "加载中...", en: "Loading..." })}
            </CardTitle>
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
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/")}>
              {pickLocale(locale, { zh: "返回首页", en: "Back to Home" })}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!invite) {
    return null;
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                {pickLocale(locale, { zh: "邀请已接受", en: "Invite Accepted" })}
              </div>
            </CardTitle>
            <CardDescription>
              {pickLocale(locale, {
                zh: "你已成功加入家庭，即将跳转到控制面板...",
                en: "You have successfully joined the family, redirecting to dashboard..."
              })}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const expiresDate = new Date(invite.expiresAt);
  const formattedExpiry = expiresDate.toLocaleDateString(
    locale === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            {pickLocale(locale, { zh: "加入家庭", en: "Join Family" })}
          </CardTitle>
          <CardDescription>
            {invite.familyName
              ? pickLocale(locale, {
                  zh: `你被邀请加入 ${invite.familyName}`,
                  en: `You've been invited to join ${invite.familyName}`
                })
              : pickLocale(locale, {
                  zh: "你被邀请加入家庭空间",
                  en: "You've been invited to join a family space"
                })
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">
              {pickLocale(locale, { zh: "邀请邮箱", en: "Invited email" })}
            </div>
            <div className="font-medium">{invite.email}</div>

            <div className="text-muted-foreground">
              {pickLocale(locale, { zh: "角色", en: "Role" })}
            </div>
            <div className="font-medium">
              {invite.role === "learner"
                ? pickLocale(locale, { zh: "学习者", en: "Learner" })
                : invite.role
              }
            </div>

            <div className="text-muted-foreground">
              {pickLocale(locale, { zh: "邀请人", en: "Invited by" })}
            </div>
            <div className="font-medium">{invite.inviterName || "—"}</div>

            <div className="text-muted-foreground">
              {pickLocale(locale, { zh: "过期时间", en: "Expires" })}
            </div>
            <div className="font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formattedExpiry}
            </div>
          </div>

          {!invite.isValid && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>
                {invite.isExpired
                  ? pickLocale(locale, { zh: "邀请已过期", en: "Invite Expired" })
                  : pickLocale(locale, { zh: "邀请已接受", en: "Invite Already Accepted" })
                }
              </AlertTitle>
              <AlertDescription>
                {invite.isExpired
                  ? pickLocale(locale, {
                      zh: "这个邀请链接已经过期，请联系管理员重新发送邀请。",
                      en: "This invite link has expired. Please contact the admin to send a new invitation."
                    })
                  : pickLocale(locale, {
                      zh: "这个邀请已经被接受过了。如果你认为这是错误，请联系管理员。",
                      en: "This invite has already been accepted. If you think this is an error, please contact the admin."
                    })
                }
              </AlertDescription>
            </Alert>
          )}

          {invite.isValid && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {pickLocale(locale, {
                  zh: "邀请有效，点击下方按钮接受邀请。",
                  en: "This invite is valid. Click the button below to accept the invitation."
                })}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {invite.isValid ? (
            <>
              <Button
                className="w-full"
                onClick={handleAccept}
                disabled={accepting}
              >
                {accepting
                  ? pickLocale(locale, { zh: "处理中...", en: "Accepting..." })
                  : pickLocale(locale, { zh: "接受邀请", en: "Accept Invite" })
                }
              </Button>
              <div className="text-xs text-muted-foreground text-center w-full">
                {pickLocale(locale, {
                  zh: "如果你还没有账号，会被引导到注册页面。",
                  en: "If you don't have an account yet, you'll be redirected to sign up."
                })}
              </div>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => router.push("/")} className="w-full">
                {pickLocale(locale, { zh: "返回首页", en: "Back to Home" })}
              </Button>
              <a
                href="/sign-in"
                className="text-sm text-muted-foreground hover:text-primary underline"
              >
                {pickLocale(locale, { zh: "已有账号？登录", en: "Already have an account? Sign in" })}
              </a>
            </>
          )}

          {!invite.isValid && (
            <div className="flex gap-3 w-full">
              <Button variant="secondary" asChild className="flex-1">
                <a href="/sign-in">
                  {pickLocale(locale, { zh: "登录", en: "Sign In" })}
                </a>
              </Button>
              <Button asChild className="flex-1">
                <a href="/create-account">
                  {pickLocale(locale, { zh: "注册", en: "Sign Up" })}
                </a>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
