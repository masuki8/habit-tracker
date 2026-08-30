import { Check } from "lucide-react";
import { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export type HabitFormValue = {
  title: string;
  description: string;
};

type HabitFormProps = {
  heading: string;
  value: HabitFormValue;
  error: string;
  isSubmitting: boolean;
  submitLabel: string;
  onChange: (value: HabitFormValue) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function HabitForm({
  heading,
  value,
  error,
  isSubmitting,
  submitLabel,
  onChange,
  onSubmit,
}: HabitFormProps) {
  function update(patch: Partial<HabitFormValue>) {
    onChange({ ...value, ...patch });
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <div className="flex items-center justify-between gap-4">
        <h2>{heading}</h2>
        <Button type="submit" isLoading={isSubmitting} loadingLabel={submitLabel} aria-label={submitLabel}>
          <Check aria-hidden="true" />
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
  );
}
