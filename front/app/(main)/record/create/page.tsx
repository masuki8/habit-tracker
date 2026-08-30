"use client";

import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ErrorScreen } from "@/components/ui/error-screen";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { apiFetch } from "@/lib/api";
import { requireAccessToken } from "@/lib/auth-session";
import { saveFlashMessage } from "@/lib/flash-message";
import { type PageLoadError, toPageLoadError } from "@/lib/page-load-error";
import { RecordForm, type RecordFormSubmission } from "../_components/record-form";
import { DATE_FORMAT, DEFAULT_LEVEL, type HabitOption } from "../_components/record-form";

export default function CreateRecordPage() {
  const requestedHabitId = useSearchParams().get("habitId") ?? "";
  const router = useRouter();
  const [loadError, setLoadError] = useState<PageLoadError | null>(null);
  const [habits, setHabits] = useState<HabitOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHabits() {
      try {
        const token = requireAccessToken();
        const fetchedHabits = await apiFetch<HabitOption[]>("/me/habits", {
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

  async function createRecord(value: RecordFormSubmission) {
    const token = requireAccessToken();
    await apiFetch("/me/records", {
      method: "POST",
      token,
      body: JSON.stringify(value),
    });
    saveFlashMessage({ message: "記録を登録しました。", variant: "success" });
    router.push(`/habit/${value.habitId}`);
  }

  if (isLoading) return <LoadingScreen message="習慣を読み込んでいます..." />;
  if (loadError?.isNotFound) {
    return <ErrorScreen title="習慣が見つかりません" message="指定された習慣は存在しないか、記録を作成する権限がありません。" />;
  }
  if (loadError) {
    return <ErrorScreen message={loadError?.message ?? "習慣を取得できませんでした。"} />;
  }

  return <RecordForm
    mode="create"
    habits={habits}
    initialValue={{
      habitId: requestedHabitId,
      recordDate: format(new Date(), DATE_FORMAT),
      content: "",
      level: DEFAULT_LEVEL,
      imageUrl: null,
    }}
    onSubmit={createRecord}
  />;
}
