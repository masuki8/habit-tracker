"use client";

import { Check } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { FormCard } from "@/components/ui/form-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export type HabitFormValue = {
  title: string;
  description: string;
};

type HabitFormProps = {
  mode: "create" | "edit";
  initialValue: HabitFormValue;
  onSubmit: (value: HabitFormValue) => Promise<void>;
};

const COPY = {
  create: {
    action: "作成",
    submitAction: "登録",
  },
  edit: {
    action: "編集",
    submitAction: "更新",
  },
} as const;

export function HabitForm({ mode, initialValue, onSubmit }: HabitFormProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = COPY[mode];

  function update(patch: Partial<HabitFormValue>) {
    setValue((current) => ({ ...current, ...patch }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit({
        title: value.title.trim(),
        description: value.description.trim(),
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : `習慣を${copy.submitAction}できませんでした。`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormCard className="mx-auto w-full max-w-3xl">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="flex items-center justify-between gap-4">
          <h2>{`習慣を${copy.action}`}</h2>
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingLabel={`${copy.action}中`}
            aria-label={`習慣を${copy.submitAction}`}
          >
            <span className="inline-flex items-center gap-2">
              <Check className="size-4" aria-hidden="true" />
              {copy.submitAction}
            </span>
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="habit-title">習慣名</Label>
          <Input
            id="habit-title"
            required
            maxLength={100}
            value={value.title}
            onChange={(event) => update({ title: event.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="habit-description">説明</Label>
          <Textarea
            id="habit-description"
            rows={4}
            value={value.description}
            onChange={(event) => update({ description: event.target.value })}
          />
        </div>
      </form>
    </FormCard>
  );
}
