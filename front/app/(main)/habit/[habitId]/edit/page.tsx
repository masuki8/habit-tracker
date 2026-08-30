"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { FormCard } from "@/components/ui/form-card";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-session";
import { saveFlashMessage } from "@/lib/flash-message";
import { HabitForm, type HabitFormValue } from "../../_components/habit-form";

type HabitResponse = HabitFormValue & { id: number };

export default function EditHabitPage() {
  const { habitId } = useParams<{ habitId: string }>();
  const router = useRouter();
  const [value, setValue] = useState<HabitFormValue | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHabit() {
      try {
        const token = getAccessToken();
        if (!token) throw new Error("認証情報を取得できませんでした。");
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
          setError(requestError instanceof Error ? requestError.message : "習慣を取得できませんでした。");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchHabit();
    return () => controller.abort();
  }, [habitId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value) return;
    setError("");
    setIsSubmitting(true);

    try {
      const token = getAccessToken();
      if (!token) throw new Error("認証情報を取得できませんでした。");
      await apiFetch(`/me/habits/${habitId}`, {
        method: "PUT",
        token,
        body: JSON.stringify({ ...value, title: value.title.trim(), description: value.description.trim() }),
      });
      saveFlashMessage({ message: "習慣を更新しました。", variant: "success" });
      router.push(`/habit/${habitId}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "習慣を更新できませんでした。");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <LoadingScreen message="習慣を読み込んでいます..." />;
  if (!value) return <ErrorMessage>{error || "習慣が見つかりませんでした。"}</ErrorMessage>;

  return (
    <FormCard className="mx-auto w-full max-w-3xl">
      <HabitForm
        heading="習慣を編集"
        value={value}
        error={error}
        isSubmitting={isSubmitting}
        submitLabel="更新中"
        onChange={setValue}
        onSubmit={handleSubmit}
      />
    </FormCard>
  );
}
