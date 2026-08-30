"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ErrorScreen } from "@/components/ui/error-screen";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { apiFetch } from "@/lib/api";
import { requireAccessToken } from "@/lib/auth-session";
import { saveFlashMessage } from "@/lib/flash-message";
import { type PageLoadError, toPageLoadError } from "@/lib/page-load-error";
import type { HabitResponse, RecordResponse } from "@/types/api";
import { RecordForm, type RecordFormSubmission, type RecordFormValue, DEFAULT_LEVEL } from "../../_components/record-form";

export default function EditRecordPage() {
  const { recordId } = useParams<{ recordId: string }>();
  const router = useRouter();
  const [record, setRecord] = useState<RecordResponse | null>(null);
  const [loadError, setLoadError] = useState<PageLoadError | null>(null);
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRecord() {
      try {
        const token = requireAccessToken();
        const [fetchedRecord, fetchedHabits] = await Promise.all([
          apiFetch<RecordResponse>(`/me/records/${recordId}`, {
            token,
            signal: controller.signal,
          }),
          apiFetch<HabitResponse[]>("/me/habits", {
            token,
            signal: controller.signal,
          }),
        ]);
        setRecord(fetchedRecord);
        setHabits(fetchedHabits);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setLoadError(toPageLoadError(requestError, "記録を取得できませんでした。"));
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchRecord();
    return () => controller.abort();
  }, [recordId]);

  async function updateRecord(value: RecordFormSubmission) {
    if (!record) return;
    const token = requireAccessToken();
    await apiFetch(`/me/records/${record.id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(value),
    });
    saveFlashMessage({ message: "記録を更新しました。", variant: "success" });
    router.push(`/habit/${value.habitId}`);
  }

  if (isLoading) return <LoadingScreen message="記録を読み込んでいます..." />;
  if (loadError?.isNotFound) {
    return <ErrorScreen title="記録が見つかりません" message="指定された記録は存在しないか、編集する権限がありません。" />;
  }
  const habitExists = record && habits.some((habit) => habit.id === record.habitId);
  if (loadError || !record || !habitExists) {
    return <ErrorScreen message={loadError?.message ?? "記録を取得できませんでした。"} />;
  }

  const initialValue: RecordFormValue = {
    habitId: String(record.habitId),
    recordDate: record.recordDate,
    content: record.content ?? "",
    level: record.level ?? DEFAULT_LEVEL,
    imageUrl: record.imageUrl,
  };

  return <RecordForm mode="edit" habits={habits} initialValue={initialValue} onSubmit={updateRecord} />;
}
