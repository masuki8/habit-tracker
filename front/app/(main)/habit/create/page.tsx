"use client";

import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { requireAccessToken } from "@/lib/auth-session";
import { saveFlashMessage } from "@/lib/flash-message";
import { HabitForm, type HabitFormValue } from "../_components/habit-form";

const INITIAL_VALUE: HabitFormValue = {
  title: "",
  description: "",
};

export default function CreateHabitPage() {
  const router = useRouter();

  async function createHabit(value: HabitFormValue) {
    const token = requireAccessToken();
    await apiFetch("/me/habits", {
      method: "POST",
      token,
      body: JSON.stringify(value),
    });
    saveFlashMessage({ message: "習慣を作成しました。", variant: "success" });
    router.push("/");
  }

  return <HabitForm mode="create" initialValue={INITIAL_VALUE} onSubmit={createHabit} />;
}
