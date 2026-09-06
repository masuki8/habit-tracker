"use client";

import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import { requireAccessToken } from "@/lib/auth-session";
import type { MonthlyRecordsResponse } from "@/types/api";
import { DayCell, WEEKDAYS } from "./day-cell";

type MonthlyCalendarProps = {
  habitId: number;
};

export function MonthlyRecordCalendar({ habitId }: MonthlyCalendarProps) {
  const [displayMonth, setDisplayMonth] = useState(() =>
    startOfMonth(new Date()),
  );
  const [recordsByDate, setRecordsByDate] = useState<Map<string, number>>(
    () => new Map(),
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const currentMonth = startOfMonth(new Date());

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMonthlyRecords() {
      setError("");
      setIsLoading(true);

      try {
        const token = requireAccessToken();
        const response = await apiFetch<MonthlyRecordsResponse>(
          `/habits/${habitId}/month/${format(displayMonth, "yyyy-MM")}`,
          { token, signal: controller.signal },
        );
        setRecordsByDate(
          new Map(
            response.records.map((record) => [record.recordDate, record.level]),
          ),
        );
      } catch (requestError) {
        if (controller.signal.aborted) return;

        setError(
          requestError instanceof Error && requestError.message
            ? requestError.message
            : "カレンダーを取得できませんでした。",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchMonthlyRecords();
    return () => controller.abort();
  }, [displayMonth, habitId]);

  const calendarStart = startOfWeek(startOfMonth(displayMonth));
  const calendarEnd = endOfWeek(endOfMonth(displayMonth));
  const days = [];

  for (let date = calendarStart; date <= calendarEnd; date = addDays(date, 1)) {
    days.push(date);
  }

  return (
    <section className="w-fit" aria-label="月間記録カレンダー">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
          aria-label="前の月を表示"
          onClick={() => setDisplayMonth((month) => addMonths(month, -1))}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <h3 className="font-semibold">
          {format(displayMonth, "yyyy年M月", { locale: ja })}
        </h3>
        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="次の月を表示"
          disabled={displayMonth >= currentMonth}
          onClick={() => setDisplayMonth((month) => addMonths(month, 1))}
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="text-xs text-gray-500">
            {weekday}
          </div>
        ))}
        {days.map((date) => {
          const recordDate = format(date, "yyyy-MM-dd");
          const level = recordsByDate.get(recordDate) ?? 0;
          const isOutsideMonth = !isSameMonth(date, displayMonth);
          return (
            <DayCell key={recordDate} recordDate={recordDate} level={level} />
          );
        })}
      </div>

      <div className="mt-3 min-h-5 text-center text-xs text-gray-500">
        {isLoading && "読み込み中..."}
        {!isLoading && error && <span className="text-red-600">{error}</span>}
      </div>
    </section>
  );
}
