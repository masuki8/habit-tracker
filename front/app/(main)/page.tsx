"use client";

import { useEffect, useState } from "react";

import { ErrorMessage } from "@/components/ui/error-message";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-session";
import { Card } from "./_components/card";
import Link from "next/link";

type Habit = {
  id: number;
  title: string;
  description: string;
  recordsCount: number;
};

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHabits() {
      try {
        const token = getAccessToken();
        if (!token) throw new Error("認証情報を取得できませんでした。");

        const response = await apiFetch<Habit[]>("/habits", {
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
    return <p role="status">習慣を読み込んでいます...</p>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (habits.length === 0) {
    return (
      <p className="text-sm text-gray-600">登録された習慣はありません。</p>
    );
  }

  return (
    <div className="w-full grid grid-cols-[2fr_1fr] gap-8">
      <div className="w-full grid gap-4">
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
      <div className="shrink-0">icon</div>
      <div className="grow">
        <Link href={`/habit/${habit.id}/create`}>
          <h2>{habit.title}</h2>
          {habit.description && (
            <p className="mt-2 text-sm text-gray-600">{habit.description}</p>
          )}
        </Link>
      </div>

      <div className="text-4xl">{habit.recordsCount}</div>
      <div>heatMap</div>
      <div>
        <Link href={`/habit/${habit.id}/create`}>記録する</Link>
      </div>
    </Card>
  );
}
