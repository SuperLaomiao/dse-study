"use client";

import { useState } from "react";

import { pickLocale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Copy, Check } from "lucide-react";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: "en" | "zh";
}

export default function InviteModal({ open, onOpenChange, locale }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"learner">("learner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInviteUrl(null);

    try {
      const response = await fetch("/api/invites/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create invite");
      }

      setInviteUrl(data.inviteUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after close
    setTimeout(() => {
      setEmail("");
      setRole("learner");
      setError(null);
      setInviteUrl(null);
      setCopied(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {pickLocale(locale, { zh: "邀请成员", en: "Invite Member" })}
          </DialogTitle>
          <DialogDescription>
            {pickLocale(locale, {
              zh: "发送邀请链接给新成员，加入你的家庭空间。",
              en: "Send an invite link to a new member to join your family space."
            })}
          </DialogDescription>
        </DialogHeader>

        {!inviteUrl ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {pickLocale(locale, { zh: "邮箱地址", en: "Email Address" })}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="learner@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  {pickLocale(locale, { zh: "角色", en: "Role" })}
                </Label>
                <Select value={role} onValueChange={(v) => setRole(v as "learner")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="learner">
                      {pickLocale(locale, { zh: "学习者", en: "Learner" })}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={loading}
              >
                {pickLocale(locale, { zh: "取消", en: "Cancel" })}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? pickLocale(locale, { zh: "创建中...", en: "Creating..." })
                  : pickLocale(locale, { zh: "创建邀请", en: "Create Invite" })
                }
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
              {pickLocale(locale, {
                zh: "邀请链接创建成功！复制下面的链接发给被邀请者。",
                en: "Invite link created successfully! Copy the link below and send it to the invitee."
              })}
            </div>

            <div className="space-y-2">
              <Label>
                {pickLocale(locale, { zh: "邀请链接", en: "Invite Link" })}
              </Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={inviteUrl}
                  className="text-xs"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={handleCopy}
                  variant="secondary"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-green-600">
                  {pickLocale(locale, { zh: "已复制！", en: "Copied!" })}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleClose}>
                {pickLocale(locale, { zh: "完成", en: "Done" })}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
