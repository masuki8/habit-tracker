"use client";

import { addDays, format, parseISO } from "date-fns";
import { Check, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { FormCard } from "@/components/ui/form-card";
import { ErrorMessage } from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-session";
import { saveFlashMessage } from "@/lib/flash-message";

type Habit = { id: number; title: string };

const LEVELS = [1, 2, 3, 4, 5];
const DATE_FORMAT = "yyyy-MM-dd";
const EARLIEST_RECORD_DAYS_AGO = 2;

export default function RecordPage() {
  const { habitId } = useParams<{ habitId: string }>();
  const router = useRouter();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [recordDate, setRecordDate] = useState(format(new Date(), DATE_FORMAT));
  const [content, setContent] = useState("");
  const [level, setLevel] = useState(3);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchHabit() {
      try {
        const token = getAccessToken();
        if (!token) throw new Error("認証情報を取得できませんでした。");

        const response = await apiFetch<Habit>(`/habits/${habitId}`, {
          token,
          signal: controller.signal,
        });
        setHabit(response);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "習慣を取得できませんでした。",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }
    fetchHabit();
    return () => controller.abort();
  }, [habitId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const token = getAccessToken();
      if (!token) throw new Error("認証情報を取得できませんでした。");
      await apiFetch("/records", {
        method: "POST",
        token,
        body: JSON.stringify({
          habitId: Number(habitId),
          recordDate,
          content: content.trim(),
          level,
          imageUrl: null,
        }),
      });
      saveFlashMessage({ message: "記録を登録しました。", variant: "success" });
      router.push("/");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "記録を登録できませんでした。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const today = new Date();
  const minDate = format(addDays(today, -2), DATE_FORMAT);
  const maxDate = format(today, DATE_FORMAT);

  return (
    <FormCard className="mx-auto w-full max-w-7xl">
      {isLoading ? (
        <p className="text-center text-sm text-gray-500" role="status">
          習慣を読み込んでいます...
        </p>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <div className="flex justify-between gap-3">
            <h2 aria-label="習慣">{habit?.title}</h2>
            <Button
              type="submit"
              disabled={!habit}
              isLoading={isSubmitting}
              loadingLabel="登録中"
            >
              <Check />
            </Button>
          </div>

          <RecordDatePicker
            value={recordDate}
            min={minDate}
            max={maxDate}
            onChange={setRecordDate}
          />

          <LevelPicker value={level} onChange={setLevel} />

          <div>
            <Textarea
              id="content"
              placeholder="今日の記録を書いてください"
              className="h-100"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>
          <Button variant="simple" className="flex justify-items-end">
            テンプレートとして登録する
          </Button>
        </form>
      )}
    </FormCard>
  );
}

type RecordDatePickerProps = {
  value: string;
  min: string;
  max: string;
  onChange: (date: string) => void;
};

function RecordDatePicker({
  value,
  min,
  max,
  onChange,
}: RecordDatePickerProps) {
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
        className="w-fit appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
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
