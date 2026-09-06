"use client";

import { addDays, format, parseISO } from "date-fns";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Flame,
} from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { FormCard } from "@/components/ui/form-card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { HabitResponse, TemplateResponse } from "@/types/api";
import { requireAccessToken } from "@/lib/auth-session";
import { apiFetch } from "@/lib/api";
import { saveFlashMessage } from "@/lib/flash-message";

export const DATE_FORMAT = "yyyy-MM-dd";
export const DEFAULT_LEVEL = 3;
const LEVELS = [1, 2, 3, 4, 5];

export type RecordFormValue = {
  habitId: string;
  recordDate: string;
  content: string;
  level: number;
  imageUrl: string | null;
};

export type RecordFormSubmission = Omit<RecordFormValue, "habitId"> & {
  habitId: number;
};

type RecordFormProps = {
  mode: "create" | "edit";
  habits: HabitResponse[];
  initialValue: RecordFormValue;
  onSubmit: (value: RecordFormSubmission) => Promise<void>;
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

export function RecordForm({
  mode,
  habits,
  initialValue,
  onSubmit,
}: RecordFormProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = format(new Date(), DATE_FORMAT);
  const habit = habits.find((item) => String(item.id) === value.habitId);
  const minDate = habit?.createdAt.slice(0, 10) ?? today;
  const copy = COPY[mode];

  function update(patch: Partial<RecordFormValue>) {
    setValue((current) => ({ ...current, ...patch }));
  }

  function changeHabit(habitId: string) {
    const nextHabit = habits.find((item) => String(item.id) === habitId);
    const nextMinDate = nextHabit?.createdAt.slice(0, 10);

    setError("");
    update({
      habitId,
      recordDate:
        nextMinDate && value.recordDate < nextMinDate
          ? today
          : value.recordDate,
    });
  }

  async function applayTemplate() {
    if (!habit) return;
    if (value.content) {
      alert("現在入力中の内容が破棄されますがよろしいですか？")
    }
    try {
      const token = requireAccessToken();
      const template = await apiFetch<TemplateResponse>(
        `/me/habits/${habit.id}/template`,
        {
          method: "GET",
          token,
        },
      );
      update({
        content: template ? template.content : value.content,
      });
      saveFlashMessage({
        message: "テンプレートを適用しました。",
        variant: "success",
      });
    } catch (requestError) {
      saveFlashMessage({
        message:
          requestError instanceof Error
            ? requestError.message
            : "テンプレートのに失敗しました。",
        variant: "error",
      });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!habit) {
      setError("記録する習慣を選択してください。");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...value,
        habitId: habit.id,
        content: value.content.trim(),
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : `記録を${copy.submitAction}できませんでした。`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormCard className="mx-auto w-full max-w-7xl">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="flex justify-between gap-3">
          <h2>
            {habit ? `${habit.title}を${copy.action}` : `記録を${copy.action}`}
          </h2>
          <Button
            type="submit"
            disabled={!habit}
            isLoading={isSubmitting}
            loadingLabel={`${copy.submitAction}中`}
            aria-label={`記録を${copy.submitAction}`}
          >
            <Check aria-hidden="true" />
          </Button>
        </div>
        <HabitSelector
          habits={habits}
          value={value.habitId}
          onChange={changeHabit}
        />
        <RecordDatePicker
          value={value.recordDate}
          min={minDate}
          max={today}
          onChange={(recordDate) => update({ recordDate })}
        />
        <LevelPicker
          value={value.level}
          onChange={(level) => update({ level })}
        />
        <Textarea
          id="content"
          aria-label="記録内容"
          placeholder="今日の記録を書いてください"
          className="h-100"
          value={value.content}
          onChange={(event) => update({ content: event.target.value })}
        />
        <Button type="button" className="float-right" onClick={applayTemplate}>
          <Clipboard />
        </Button>
        <TemplateRegistor habit={habit} content={value.content} />
      </form>
    </FormCard>
  );
}

function RecordDatePicker({
  value,
  min,
  max,
  onChange,
}: {
  value: string;
  min: string;
  max: string;
  onChange: (date: string) => void;
}) {
  function updateDate(date: string) {
    if (date >= min && date <= max) onChange(date);
  }

  function moveDate(days: number) {
    updateDate(format(addDays(parseISO(value), days), DATE_FORMAT));
  }

  return (
    <div className="float-right flex items-center gap-1">
      <button
        type="button"
        aria-label="前の日"
        onClick={() => moveDate(-1)}
        disabled={value <= min}
        className="p-2"
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <Input
        id="record-date"
        aria-label="記録日"
        type="date"
        required
        value={value}
        min={min}
        max={max}
        onChange={(event) => updateDate(event.target.value)}
      />
      <button
        type="button"
        aria-label="次の日"
        onClick={() => moveDate(1)}
        disabled={value >= max}
        className="p-2"
      >
        <ChevronRight aria-hidden="true" />
      </button>
    </div>
  );
}

function LevelPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (level: number) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">達成レベル</legend>
      <div className="flex gap-2">
        {LEVELS.map((level) => (
          <label key={level} className="cursor-pointer rounded p-1">
            <input
              className="sr-only"
              type="radio"
              name="level"
              value={level}
              checked={value === level}
              onChange={() => onChange(level)}
            />
            <span className="sr-only">レベル{level}</span>
            <Flame
              className={
                level <= value
                  ? "fill-orange-400 text-orange-400"
                  : "text-gray-300"
              }
              aria-hidden="true"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function HabitSelector({
  habits,
  value,
  onChange,
}: {
  habits: HabitResponse[];
  value: string;
  onChange: (habitId: string) => void;
}) {
  return (
    <div className="space-y-2">
      <select
        id="habit-select"
        className="form-control"
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">習慣を選択してください</option>
        {habits.map((habit) => (
          <option key={habit.id} value={habit.id}>
            {habit.title}
          </option>
        ))}
      </select>
    </div>
  );
}

function TemplateRegistor({
  habit,
  content,
}: {
  habit: HabitResponse | undefined;
  content: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function onClick() {
    if (!habit || !content) return;
    setIsSubmitting(true);
    try {
      const token = requireAccessToken();
      const template = await apiFetch<TemplateResponse>(
        `/me/habits/${habit.id}/template`,
        {
          method: "GET",
          token,
        },
      );
      await apiFetch(`/me/habits/${habit.id}/template`, {
        method: template ? "PUT" : "POST",
        token,
        body: JSON.stringify({ content: content }),
      });
      saveFlashMessage({
        message: "テンプレートを登録しました。",
        variant: "success",
      });
    } catch (requestError) {
      saveFlashMessage({
        message:
          requestError instanceof Error
            ? requestError.message
            : "テンプレートの登録に失敗しました。",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Button
      variant="simple"
      type="button"
      disabled={!habit || !content}
      onClick={onClick}
      isLoading={isSubmitting}
    >
      現在の内容をテンプレートとして登録する
    </Button>
  );
}
