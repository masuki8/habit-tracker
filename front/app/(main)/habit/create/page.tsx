"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { FormCard } from "@/components/ui/form-card";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-session";
import { saveFlashMessage } from "@/lib/flash-message";
import { HabitForm, type HabitFormValue } from "../_components/habit-form";

const INITIAL_VALUE: HabitFormValue = {
  title: "",
  description: "",
};

export default function CreateHabitPage() {
  const router = useRouter();
  const [value, setValue] = useState(INITIAL_VALUE);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const token = getAccessToken();
      if (!token) throw new Error("認証情報を取得できませんでした。");
      await apiFetch("/me/habits", {
        method: "POST",
        token,
        body: JSON.stringify({ ...value, title: value.title.trim(), description: value.description.trim() }),
      });
      saveFlashMessage({ message: "習慣を作成しました。", variant: "success" });
      router.push("/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "習慣を作成できませんでした。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormCard className="mx-auto w-full max-w-3xl">
      <HabitForm
        heading="習慣を作成"
        value={value}
        error={error}
        isSubmitting={isSubmitting}
        submitLabel="作成中"
        onChange={setValue}
        onSubmit={handleSubmit}
      />
    </FormCard>
  );
}
