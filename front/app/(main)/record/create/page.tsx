"use client";

import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { requireAccessToken } from "@/lib/auth-session";
import { saveFlashMessage } from "@/lib/flash-message";
import { RecordForm, RecordFormValue, type RecordFormSubmission } from "../_components/record-form";
import { DATE_FORMAT, DEFAULT_LEVEL } from "../_components/record-form";

export default function CreateRecordPage() {
  const requestedHabitId = useSearchParams().get("habitId") ?? "";
  const router = useRouter();

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

  const initialValue: RecordFormValue = {
    habitId: requestedHabitId,
    recordDate: format(new Date(), DATE_FORMAT),
    content: "",
    level: DEFAULT_LEVEL,
    imageUrl: null,
  };

  return <RecordForm
    mode="create"
    initialValue={initialValue}
    onSubmit={createRecord}
  />;
}
