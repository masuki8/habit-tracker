"use client";

import { Flame, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ErrorMessage } from "@/components/ui/error-message";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-session";
import { Card } from "../../_components/card";

type Habit = {
  id: number;
  title: string;
  description: string;
  recordsCount: number;
};

type RecordItem = {
  id: number;
  habitId: number;
  content: string | null;
  imageUrl: string | null;
  recordDate: string;
  level: number | null;
};

export default function HabitDetailPage() {
  const { habitId } = useParams<{ habitId: string }>();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHabitDetail() {
      try {
        const token = getAccessToken();
        if (!token) throw new Error("認証情報を取得できませんでした。");

        const [habitResponse, recordsResponse] = await Promise.all([
          apiFetch<Habit>(`/habits/${habitId}`, {
            token,
            signal: controller.signal,
          }),
          apiFetch<RecordItem[]>(`/habits/${habitId}/records`, {
            token,
            signal: controller.signal,
          }),
        ]);

        setHabit(habitResponse);
        setRecords(
          recordsResponse.toSorted(
            (a, b) =>
              b.recordDate.localeCompare(a.recordDate) || b.id - a.id,
          ),
        );
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setError(
          requestError instanceof Error && requestError.message
            ? requestError.message
            : "習慣の詳細を取得できませんでした。",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchHabitDetail();
    return () => controller.abort();
  }, [habitId]);

  if (isLoading) return <p role="status">習慣を読み込んでいます...</p>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!habit) return <ErrorMessage>習慣が見つかりませんでした。</ErrorMessage>;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2>{habit.title}</h2>
            {habit.description && (
              <p className="mt-2 text-sm text-gray-600">{habit.description}</p>
            )}
            <p className="mt-4 text-sm text-gray-500">
              記録数：{habit.recordsCount}件
            </p>
          </div>
          <Link
            href={`/habit/${habit.id}/record`}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-text transition hover:bg-primary-hover"
          >
            <Plus className="size-5" aria-hidden="true" />
            記録する
          </Link>
        </div>
      </Card>

      <section aria-labelledby="record-list-title">
        <h2 id="record-list-title" className="mb-3">
          記録一覧
        </h2>
        {records.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-500">まだ記録がありません。</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {records.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function RecordCard({ record }: { record: RecordItem }) {
  const level = record.level ?? 0;

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <time className="text-sm font-semibold" dateTime={record.recordDate}>
            {record.recordDate}
          </time>
          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
            {record.content || "メモはありません。"}
          </p>
        </div>
        <div className="flex shrink-0" aria-label={`レベル${level}`}>
          {Array.from({ length: level }, (_, index) => (
            <Flame
              key={index}
              className="size-5 fill-orange-400 text-orange-400"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
