"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { LoadingScreen } from "@/components/ui/loading-screen";
import { apiFetch } from "@/lib/api";
import { requireAccessToken } from "@/lib/auth-session";
import { Card } from "./_components/card";
import {
  TwoWeekRecordCalendar,
  type DailyRecord,
} from "./_components/two-week-record-calendar";
import { ErrorScreen } from "@/components/ui/error-screen";
type Habit = {
  id: number;
  title: string;
  description: string;
  recordsCount: number;
  twoWeekRecords: DailyRecord[];
};

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHabits() {
      try {
        const token = requireAccessToken();

        const response = await apiFetch<Habit[]>("/me/habits", {
          token,
          signal: controller.signal,
        });
        setHabits(response);
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

    fetchHabits();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return <LoadingScreen message="習慣を読み込んでいます..." />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  if (habits.length === 0) {
    return (
      <div className="rounded-lg bg-surface p-8 text-center">
        <p className="text-sm text-gray-600">登録された習慣はありません。</p>
        <CreateHabitLink className="mt-4" />
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-[2fr_1fr] gap-8">
      <div className="grid w-full gap-4">
        <div className="flex justify-end">
          <CreateHabitLink />
        </div>
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </div>
      <Card>
        <h2>集計</h2>
      </Card>
    </div>
  );
}

function HabitCard({ habit }: { habit: Habit }) {
  return (
    <Card className="flex gap-4">
      <div className="grow">
        <Link href={`/habit/${habit.id}`}>
          <h2>{habit.title}</h2>
          {habit.description && (
            <p className="mt-2 text-sm text-gray-600">{habit.description}</p>
          )}
        </Link>
      </div>

      <div className="text-4xl">{habit.recordsCount}</div>
      <TwoWeekRecordCalendar records={habit.twoWeekRecords} />
      <div>
        <Link href={`/record/create?habitId=${habit.id}`}>記録する</Link>
      </div>
    </Card>
  );
}

function CreateHabitLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/habit/create"
      className={`inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-text transition hover:bg-primary-hover ${className}`}
    >
      <Plus className="size-5" aria-hidden="true" />
      習慣を追加
    </Link>
  );
}
