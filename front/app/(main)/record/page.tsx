"use client";

import { format } from "date-fns";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { ErrorScreen } from "@/components/ui/error-screen";
import { FormCard } from "@/components/ui/form-card";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-session";
import { saveFlashMessage } from "@/lib/flash-message";
import { type PageLoadError, toPageLoadError } from "@/lib/page-load-error";
import { DATE_FORMAT, DEFAULT_LEVEL, RecordFormFields } from "./_components/record-form-fields";

type Habit = { id: number; title: string; createdAt: string };

export default function CreateRecordPage() {
  const requestedHabitId = useSearchParams().get("habitId") ?? "";
  const router = useRouter();
  const today = new Date();
  const [loadError, setLoadError] = useState<PageLoadError | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState(requestedHabitId);
  const [recordDate, setRecordDate] = useState(format(today, DATE_FORMAT));
  const [content, setContent] = useState("");
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const habit = habits.find((item) => String(item.id) === selectedHabitId);
  const maxDate = format(today, DATE_FORMAT);
  const minDate = habit?.createdAt.slice(0, 10) ?? maxDate;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHabits() {
      try {
        const token = getAccessToken();
        if (!token) throw new Error("認証情報を取得できませんでした。");
        const fetchedHabits = await apiFetch<Habit[]>("/me/habits", {
          token,
          signal: controller.signal,
        });
        setHabits(fetchedHabits);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setLoadError(toPageLoadError(requestError, "習慣を取得できませんでした。"));
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchHabits();
    return () => controller.abort();
  }, [requestedHabitId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!habit) {
      setError("記録する習慣を選択してください。");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const token = getAccessToken();
      if (!token) throw new Error("認証情報を取得できませんでした。");
      await apiFetch("/me/records", {
        method: "POST",
        token,
        body: JSON.stringify({ habitId: habit.id, recordDate, content: content.trim(), level, imageUrl: null }),
      });
      saveFlashMessage({ message: "記録を登録しました。", variant: "success" });
      router.push(`/habit/${habit.id}`);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "記録を登録できませんでした。"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <LoadingScreen message="習慣を読み込んでいます..." />;
  if (loadError?.isNotFound) {
    return <ErrorScreen title="習慣が見つかりません" message="指定された習慣は存在しないか、記録を作成する権限がありません。" />;
  }
  if (loadError) {
    return <ErrorScreen message={loadError?.message ?? "習慣を取得できませんでした。"} />;
  }

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
          habitId={selectedHabitId}
          habits={habits}
          onRecordDateChange={setRecordDate}
          onHabitIdChange={(nextHabitId) => {
            const nextHabit = habits.find(
              (item) => String(item.id) === nextHabitId,
            );
            setSelectedHabitId(nextHabitId);
            setError("");
            if (
              nextHabit &&
              recordDate < nextHabit.createdAt.slice(0, 10)
            ) {
              setRecordDate(maxDate);
            }
          }}
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
