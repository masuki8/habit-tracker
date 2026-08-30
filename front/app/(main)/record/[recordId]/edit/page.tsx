"use client";

import { format } from "date-fns";
import { Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { FormCard } from "@/components/ui/form-card";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-session";
import { saveFlashMessage } from "@/lib/flash-message";
import { DATE_FORMAT, DEFAULT_LEVEL, RecordFormFields } from "../../_components/record-form-fields";

type RecordItem = {
  id: number;
  habitId: number;
  content: string | null;
  imageUrl: string | null;
  recordDate: string;
  level: number | null;
};

type Habit = { id: number; title: string; createdAt: string };

export default function EditRecordPage() {
  const { recordId } = useParams<{ recordId: string }>();
  const router = useRouter();
  const today = new Date();
  const [record, setRecord] = useState<RecordItem | null>(null);
  const [habit, setHabit] = useState<Habit | null>(null);
  const [recordDate, setRecordDate] = useState(format(today, DATE_FORMAT));
  const [content, setContent] = useState("");
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxDate = format(today, DATE_FORMAT);
  const minDate = habit?.createdAt.slice(0, 10) ?? maxDate;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRecord() {
      try {
        const token = getAccessToken();
        if (!token) throw new Error("認証情報を取得できませんでした。");
        const fetchedRecord = await apiFetch<RecordItem>(`/me/records/${recordId}`, { token, signal: controller.signal });
        const fetchedHabit = await apiFetch<Habit>(`/me/habits/${fetchedRecord.habitId}`, { token, signal: controller.signal });
        setRecord(fetchedRecord);
        setHabit(fetchedHabit);
        setRecordDate(fetchedRecord.recordDate);
        setContent(fetchedRecord.content ?? "");
        setLevel(fetchedRecord.level ?? DEFAULT_LEVEL);
      } catch (requestError) {
        if (!controller.signal.aborted) setError(getErrorMessage(requestError, "記録を取得できませんでした。"));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchRecord();
    return () => controller.abort();
  }, [recordId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!record) return;
    setError("");
    setIsSubmitting(true);

    try {
      const token = getAccessToken();
      if (!token) throw new Error("認証情報を取得できませんでした。");
      await apiFetch(`/me/records/${record.id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({ habitId: record.habitId, recordDate, content: content.trim(), level, imageUrl: record.imageUrl }),
      });
      saveFlashMessage({ message: "記録を更新しました。", variant: "success" });
      router.push(`/habit/${record.habitId}`);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "記録を更新できませんでした。"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <LoadingScreen message="記録を読み込んでいます..." />;

  return (
    <FormCard className="mx-auto w-full max-w-7xl">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="flex justify-between gap-3">
          <h2>{habit ? `${habit.title}の記録を編集` : "記録を編集"}</h2>
          <Button type="submit" disabled={!record} isLoading={isSubmitting} loadingLabel="更新中" aria-label="記録を更新">
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
