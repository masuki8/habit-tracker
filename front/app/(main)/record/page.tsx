"use client";

import { addDays, format } from "date-fns";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { FormCard } from "@/components/ui/form-card";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-session";
import { saveFlashMessage } from "@/lib/flash-message";
import { DATE_FORMAT, DEFAULT_LEVEL, RecordFormFields } from "./_components/record-form-fields";

type Habit = { id: number; title: string };

export default function CreateRecordPage() {
  const habitId = useSearchParams().get("habitId");
  const router = useRouter();
  const today = new Date();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [recordDate, setRecordDate] = useState(format(today, DATE_FORMAT));
  const [content, setContent] = useState("");
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const minDate = format(addDays(today, -2), DATE_FORMAT);
  const maxDate = format(today, DATE_FORMAT);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHabit() {
      try {
        if (!habitId) throw new Error("習慣が指定されていません。");
        const token = getAccessToken();
        if (!token) throw new Error("認証情報を取得できませんでした。");
        setHabit(await apiFetch<Habit>(`/me/habits/${habitId}`, { token, signal: controller.signal }));
      } catch (requestError) {
        if (!controller.signal.aborted) setError(getErrorMessage(requestError, "習慣を取得できませんでした。"));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchHabit();
    return () => controller.abort();
  }, [habitId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!habitId) return;
    setError("");
    setIsSubmitting(true);

    try {
      const token = getAccessToken();
      if (!token) throw new Error("認証情報を取得できませんでした。");
      await apiFetch("/me/records", {
        method: "POST",
        token,
        body: JSON.stringify({ habitId: Number(habitId), recordDate, content: content.trim(), level, imageUrl: null }),
      });
      saveFlashMessage({ message: "記録を登録しました。", variant: "success" });
      router.push(`/habit/${habitId}`);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "記録を登録できませんでした。"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <p role="status">習慣を読み込んでいます...</p>;

  return (
    <FormCard className="mx-auto w-full max-w-7xl">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="flex justify-between gap-3">
          <h2>{habit ? `${habit.title}を記録` : "記録を作成"}</h2>
          <Button type="submit" disabled={!habit} isLoading={isSubmitting} loadingLabel="登録中" aria-label="記録を登録">
            <Check aria-hidden="true" />
          </Button>
        </div>
        <RecordFormFields
          recordDate={recordDate}
          minDate={minDate}
          maxDate={maxDate}
          content={content}
          level={level}
          onRecordDateChange={setRecordDate}
          onContentChange={setContent}
          onLevelChange={setLevel}
        />
      </form>
    </FormCard>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
