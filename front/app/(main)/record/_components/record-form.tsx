"use client";

import { addDays, format, parseISO } from "date-fns";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Flame,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { ErrorScreen } from "@/components/ui/error-screen";
import { FormCard } from "@/components/ui/form-card";
import { LoadingScreen } from "@/components/ui/loading-screen";
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

export function RecordForm({ mode, initialValue, onSubmit }: RecordFormProps) {
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [value, setValue] = useState(initialValue);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [template, setTemplate] = useState("");
  const [isTemplateLoading, setIsTemplateLoading] = useState(
    Boolean(initialValue.habitId),
  );
  const today = format(new Date(), DATE_FORMAT);
  const habit = habits.find((item) => String(item.id) === value.habitId);
  const minDate = habit?.createdAt.slice(0, 10) ?? today;
  const copy = COPY[mode];

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHabits() {
      try {
        const token = requireAccessToken();
        const fetchedHabits = await apiFetch<HabitResponse[]>("/me/habits", {
          token,
          signal: controller.signal,
        });
        setHabits(fetchedHabits);
      } catch (requestError) {
        if (controller.signal.aborted) return;

        setLoadError(
          requestError instanceof Error && requestError.message
            ? requestError.message
            : "習慣を取得できませんでした。",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchHabits();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!value.habitId) return;

    const controller = new AbortController();

    async function fetchTemplate() {
      setTemplate("");
      setIsTemplateLoading(true);

      try {
        const token = requireAccessToken();
        const response = await apiFetch<TemplateResponse>(
          `/me/habits/${value.habitId}/template`,
          {
            token,
            signal: controller.signal,
          },
        );
        setTemplate(response.content);
      } catch {
        if (!controller.signal.aborted) setTemplate("");
      } finally {
        if (!controller.signal.aborted) setIsTemplateLoading(false);
      }
    }

    fetchTemplate();
    return () => controller.abort();
  }, [value.habitId]);

  function update(patch: Partial<RecordFormValue>) {
    setValue((current) => ({ ...current, ...patch }));
  }

  function changeHabit(habitId: string) {
    const nextHabit = habits.find((item) => String(item.id) === habitId);
    const nextMinDate = nextHabit?.createdAt.slice(0, 10);

    setError("");
    setTemplate("");
    setIsTemplateLoading(Boolean(habitId));
    update({
      habitId,
      recordDate:
        nextMinDate && value.recordDate < nextMinDate
          ? today
          : value.recordDate,
    });
  }

  function applyTemplate() {
    if (!habit || !template) return;
    if (
      value.content &&
      !window.confirm("現在入力中の内容が破棄されます。よろしいですか？")
    ) {
      return;
    }

    update({
      content: template,
    });
    saveFlashMessage({
      message: "テンプレートを適用しました。",
      variant: "success",
    });
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

  if (isLoading) {
    return <LoadingScreen message="習慣を読み込んでいます..." />;
  }

  if (loadError) {
    return <ErrorScreen message={loadError} />;
  }

  if (mode === "edit" && !habit) {
    return <ErrorScreen message="記録に紐づく習慣を取得できませんでした。" />;
  }

  return (
    <FormCard className="mx-auto w-full max-w-4xl">
      <form className="space-y-6" onSubmit={handleSubmit}>
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
            <span className="inline-flex items-center gap-2">
              <Check className="size-4" aria-hidden="true" />
              {copy.submitAction}
            </span>
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
          className="min-h-64"
          value={value.content}
          onChange={(event) => update({ content: event.target.value })}
        />
        <Button
          type="button"
          className="ml-auto flex"
          onClick={applyTemplate}
          disabled={!habit || !template || isTemplateLoading}
          isLoading={isTemplateLoading}
          loadingLabel="テンプレートを確認中"
          title={!template && !isTemplateLoading ? "登録済みのテンプレートがありません" : undefined}
        >
          <span className="inline-flex items-center gap-2">
            <Clipboard />
            テンプレートを適用する
          </span>
        </Button>
        <TemplateRegistor
          habit={habit}
          content={value.content}
          onSaved={setTemplate}
        />
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
    <div className="flex max-w-sm items-center gap-1 rounded-2xl bg-background p-2">
      <button
        type="button"
        aria-label="前の日"
        onClick={() => moveDate(-1)}
        disabled={value <= min}
        className="rounded-lg p-2 text-primary transition hover:bg-primary/10"
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
        className="rounded-lg p-2 text-primary transition hover:bg-primary/10"
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
      <div className="flex w-fit gap-1 rounded-2xl bg-background p-2">
        {LEVELS.map((level) => (
          <label
            key={level}
            className="cursor-pointer rounded-lg p-1 transition hover:bg-white"
          >
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
                  ? "fill-secondary text-secondary"
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
  onSaved,
}: {
  habit: HabitResponse | undefined;
  content: string;
  onSaved: (content: string) => void;
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
      onSaved(content);
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
      disabled={!habit || !content.trim()}
      onClick={onClick}
      isLoading={isSubmitting}
    >
      現在の内容をテンプレートとして登録する
    </Button>
  );
}
