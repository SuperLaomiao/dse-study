"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { calculateDSELevel } from "@/lib/assessment/questions";
import { useI18n } from "@/lib/i18n/client";
import { saveAssessmentResultAction } from "@/app/actions/assessment";
import { useActionState } from "react";
import { idleAssessmentActionState } from "@/lib/action-states";

function AssessmentResultContent() {
  const searchParams = useSearchParams();
  const correct = parseInt(searchParams.get("correct") || "0");
  const total = parseInt(searchParams.get("total") || "12");
  const { level, band } = calculateDSELevel(correct);
  const t = useI18n("assessment");
  const [state, action, pending] = useActionState(
    saveAssessmentResultAction,
    idleAssessmentActionState
  );

  const getLevelDescription = () => {
    return t(`levelDescription.${level}` as any);
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[32px] border border-[rgba(35,64,43,0.08)] bg-[linear-gradient(145deg,rgba(248,243,234,0.96),rgba(233,244,237,0.92))] p-8 shadow-[0_16px_36px_rgba(66,51,27,0.08)]">
          <h1 className="text-center text-3xl font-bold text-[var(--foreground)]">
            {t("resultTitle")}
          </h1>

          <div className="mt-8 text-center">
            <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-[var(--brand)] text-5xl font-bold text-white shadow-[0_16px_36px_rgba(35,64,43,0.18)]">
              {level}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
              {t("yourLevel")}: DSE {level}**
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {t("correctAnswers")}: {correct} {t("outOf")} {total}
            </p>
          </div>

          <div className="mt-6 rounded-[24px] bg-white/70 p-6">
            <p className="text-sm leading-7 text-[#435443]">
              {getLevelDescription()}
            </p>
          </div>

          <form action={action} className="mt-8 space-y-4">
            <input type="hidden" name="level" value={level.toString()} />
            <input type="hidden" name="band" value={band} />
            <input type="hidden" name="correct" value={correct.toString()} />
            <input type="hidden" name="total" value={total.toString()} />

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-[#23402b] px-6 py-3 text-sm font-semibold text-[#f7f3ea] shadow-[0_14px_24px_rgba(35,64,43,0.18)] transition hover:bg-[#1f3626] disabled:opacity-60"
            >
              {pending ? t("submitting") : t("saveAndContinue")}
            </button>

            <a
              href="/assessment/take"
              className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(35,64,43,0.16)] bg-white/75 px-6 py-3 text-sm font-semibold text-[#23402b] transition hover:bg-white"
            >
              {t("retake")}
            </a>
          </form>

          {state.status !== "idle" && (
            <div
              className={`mt-6 rounded-2xl px-4 py-3 text-sm ${
                state.status === "error"
                  ? "bg-[rgba(196,90,64,0.08)] text-[#9f3a28]"
                  : "bg-[rgba(47,95,60,0.09)] text-[#2f5f3c]"
              }`}
            >
              {state.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AssessmentResultPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AssessmentResultContent />
    </Suspense>
  );
}
