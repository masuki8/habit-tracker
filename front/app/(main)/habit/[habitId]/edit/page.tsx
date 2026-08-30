"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LoadingScreen } from "@/components/ui/loading-screen";
import { ErrorScreen } from "@/components/ui/error-screen";
import { apiFetch } from "@/lib/api";
import { requireAccessToken } from "@/lib/auth-session";
import { saveFlashMessage } from "@/lib/flash-message";
import { type PageLoadError, toPageLoadError } from "@/lib/page-load-error";
import type { HabitResponse } from "@/types/api";
import {
  HabitForm,
  type HabitFormValue,
} from "../../_components/habit-form";

export default function EditHabitPage() {
  const { habitId } = useParams<{ habitId: string }>();
  const router = useRouter();
  const [value, setValue] = useState<HabitFormValue | null>(null);
  const [loadError, setLoadError] = useState<PageLoadError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHabit() {
      try {
        const token = requireAccessToken();
        const habit = await apiFetch<HabitResponse>(`/me/habits/${habitId}`, {
          token,
          signal: controller.signal,
        });
        setValue({
          title: habit.title,
          description: habit.description ?? "",
        });
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setLoadError(
            toPageLoadError(requestError, "習慣を取得できませんでした。"),
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchHabit();
    return () => controller.abort();
  }, [habitId]);

  async function updateHabit(nextValue: HabitFormValue) {
    const token = requireAccessToken();
    await apiFetch(`/me/habits/${habitId}`, {
      method: "PUT",
      token,
      body: JSON.stringify(nextValue),
    });
    saveFlashMessage({ message: "習慣を更新しました。", variant: "success" });
    router.push(`/habit/${habitId}`);
  }

  if (isLoading) return <LoadingScreen message="習慣を読み込んでいます..." />;
  if (loadError?.isNotFound) {
    return (
      <ErrorScreen
        title="習慣が見つかりません"
        message="指定された習慣は存在しないか、編集する権限がありません。"
      />
    );
  }
  if (loadError || !value) {
    return (
      <ErrorScreen
        message={loadError?.message ?? "習慣を取得できませんでした。"}
      />
    );
  }

  return <HabitForm mode="edit" initialValue={value} onSubmit={updateHabit} />;
}
