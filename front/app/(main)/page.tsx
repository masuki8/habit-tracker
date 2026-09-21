"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  CirclePlus,
  ListChecks,
  PencilLine,
  Plus,
} from "lucide-react";

import { ErrorScreen } from "@/components/ui/error-screen";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { apiFetch } from "@/lib/api";
import { requireAccessToken } from "@/lib/auth-session";
import type { HabitResponse, UserResponse } from "@/types/api";
import { TwoWeekRecordCalendar } from "./_components/two-week-record-calendar";

export default function Home() {
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDashboard() {
      try {
        const token = requireAccessToken();
        const [habitResponse, userResponse] = await Promise.all([
          apiFetch<HabitResponse[]>("/me/habits", {
            token,
            signal: controller.signal,
          }),
          apiFetch<UserResponse>("/me", {
            token,
            signal: controller.signal,
          }),
        ]);

        setHabits(habitResponse);
        setUser(userResponse);
      } catch (requestError) {
        if (controller.signal.aborted) return;

        setError(
          requestError instanceof Error && requestError.message
            ? requestError.message
            : "習慣の一覧を取得できませんでした。",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchDashboard();

    return () => controller.abort();
  }, []);

  const summary = useMemo(() => {
    const totalRecords = habits.reduce(
      (total, habit) => total + habit.recordsCount,
      0,
    );
    const today = new Date().toLocaleDateString("sv-SE");
    const completedToday = habits.filter((habit) =>
      habit.twoWeekRecords.some(
        (record) => record.recordDate === today && record.level > 0,
      ),
    ).length;

    return {
      totalRecords,
      completedToday,
      completionRate:
        habits.length === 0
          ? 0
          : Math.round((completedToday / habits.length) * 100),
    };
  }, [habits]);

  if (isLoading) {
    return <LoadingScreen message="習慣を読み込んでいます..." />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  return (
    <div className="space-y-7 pb-10">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl">
            {getGreeting()}、{user?.name ?? "ゲスト"}さん
          </h1>
        </div>
        <CreateHabitLink />
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg">My Habits</h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {habits.length}
              </span>
            </div>
          </div>

          {habits.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {habits.map((habit, index) => (
                <HabitCard key={habit.id} habit={habit} index={index} />
              ))}
            </div>
          )}

          {habits.length > 0 && (
            <Link
              href="/habit/create"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-hover"
            >
              <CirclePlus className="size-4" />
              Habitを追加する
            </Link>
          )}
        </section>

        <DashboardSummary habits={habits} summary={summary} />
      </div>
    </div>
  );
}

function HabitCard({ habit, index }: { habit: HabitResponse; index: number }) {
  const accentClasses = ["bg-primary-light", "bg-secondary", "bg-accent-yellow"];
  const accentClass = accentClasses[index % accentClasses.length];

  return (
    <article className="group grid gap-5 rounded-2xl border border-black/5 bg-surface p-4 shadow-[0_8px_30px_rgba(29,29,29,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(29,29,29,0.08)] sm:p-5 lg:grid-cols-[minmax(220px,1fr)_100px] xl:grid-cols-[minmax(210px,1fr)_88px_245px_auto] xl:items-center">
      <Link href={`/habit/${habit.id}`} className="flex min-w-0 items-center gap-4">
        <span
          className={`grid size-14 shrink-0 place-items-center rounded-2xl text-xl font-bold text-white shadow-sm ${accentClass}`}
        >
          {habit.title.slice(0, 1)}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1 font-bold tracking-[-0.015em]">
            <span className="truncate">{habit.title}</span>
            <ChevronRight className="size-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
          </span>
          <span className="mt-1 line-clamp-2 block text-sm text-gray-500">
            {habit.description || "今日の目標を記録しましょう"}
          </span>
        </span>
      </Link>

      <div className="flex items-end gap-2 lg:block lg:text-center">
        <strong className="text-3xl font-bold leading-none tracking-[-0.04em] text-ink-brown">
          {habit.recordsCount}
        </strong>
        <span className="text-xs font-semibold text-ink-brown lg:mt-1 lg:block">
          records
        </span>
      </div>

      <div className="min-w-0 border-t border-black/5 pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
        <TwoWeekRecordCalendar records={habit.twoWeekRecords} />
      </div>

      <Link
        href={`/record/create?habitId=${habit.id}`}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary px-4 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-text"
      >
        <PencilLine className="size-4" aria-hidden="true" />
        記録する
      </Link>
    </article>
  );
}

function DashboardSummary({
  habits,
  summary,
}: {
  habits: HabitResponse[];
  summary: {
    totalRecords: number;
    completedToday: number;
    completionRate: number;
  };
}) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-5">
      <div className="rounded-2xl border border-black/5 bg-surface p-6 shadow-[0_8px_30px_rgba(29,29,29,0.04)]">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">今日の進捗</h2>
          <span className="grid size-9 place-items-center rounded-full bg-accent-yellow/15 text-accent-yellow">
            <ListChecks className="size-4" />
          </span>
        </div>

        <div className="mt-6 flex items-center gap-5">
          <div
            className="relative grid size-28 shrink-0 place-items-center rounded-full"
            style={{
              background: `conic-gradient(var(--color-primary) ${summary.completionRate}%, var(--color-background) 0)`,
            }}
          >
            <div className="grid size-20 place-items-center rounded-full bg-surface text-center">
              <span>
                <strong className="block text-2xl leading-none tracking-[-0.04em] text-ink-brown">
                  {summary.completionRate}%
                </strong>
                <small className="text-[11px] text-gray-500">達成率</small>
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">今日の記録</p>
            <p className="mt-1 text-2xl font-bold tracking-[-0.035em] text-ink-brown">
              {summary.completedToday}
              <span className="ml-1 text-sm font-medium text-gray-500">
                / {habits.length}
              </span>
            </p>
            <p className="mt-3 text-xs leading-5 text-gray-500">
              {summary.completedToday === habits.length && habits.length > 0
                ? "今日の習慣をすべて達成しました！"
                : "できた習慣から記録していきましょう。"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-surface p-6 shadow-[0_8px_30px_rgba(29,29,29,0.04)]">
        <h2 className="font-bold">これまでの記録</h2>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <SummaryMetric label="登録中の習慣" value={habits.length} unit="個" />
          <SummaryMetric
            label="合計記録数"
            value={summary.totalRecords}
            unit="回"
          />
        </div>
      </div>
    </aside>
  );
}

function SummaryMetric({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="rounded-xl bg-background p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-[-0.035em] text-ink-brown">
        {value}
        <span className="ml-1 text-xs font-medium text-gray-500">{unit}</span>
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-primary/25 bg-surface px-6 py-16 text-center shadow-sm">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Check className="size-6" />
      </span>
      <h2 className="mt-4 font-bold">最初のHabitを作りましょう</h2>
      <p className="mt-2 text-sm text-gray-500">
        続けたいことを登録すると、日々の積み重ねを確認できます。
      </p>
      <CreateHabitLink className="mt-5" />
    </div>
  );
}

function CreateHabitLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/habit/create"
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-text shadow-sm transition hover:bg-primary-hover ${className}`}
    >
      <Plus className="size-4" />
      Habitを追加
    </Link>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "おはようございます";
  if (hour < 18) return "こんにちは";
  return "こんばんは";
}
