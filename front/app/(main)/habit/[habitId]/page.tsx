"use client";

import { Flame, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ErrorScreen } from "@/components/ui/error-screen";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ApiError, apiFetch } from "@/lib/api";
import { requireAccessToken } from "@/lib/auth-session";
import type { HabitResponse, RecordResponse } from "@/types/api";
import { Card } from "../../_components/card";
import { MonthlyRecordCalendar } from "../../_components/monthly-record-calendar";

type LoadError = {
  isNotFound: boolean;
  message: string;
};

export default function HabitDetailPage() {
  const { habitId } = useParams<{ habitId: string }>();
  const [habit, setHabit] = useState<HabitResponse | null>(null);
  const [records, setRecords] = useState<RecordResponse[]>([]);
  const [loadError, setLoadError] = useState<LoadError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHabitDetail() {
      try {
        setLoadError(null);
        const token = requireAccessToken();

        const [habitResponse, recordsResponse] = await Promise.all([
          apiFetch<HabitResponse>(`/me/habits/${habitId}`, {
            token,
            signal: controller.signal,
          }),
          apiFetch<RecordResponse[]>(`/me/habits/${habitId}/records`, {
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
        setLoadError({
          isNotFound:
            requestError instanceof ApiError && requestError.status === 404,
          message:
            requestError instanceof Error && requestError.message
              ? requestError.message
              : "習慣の詳細を取得できませんでした。",
        });
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchHabitDetail();
    return () => controller.abort();
  }, [habitId, retryCount]);

  if (isLoading) return <LoadingScreen message="習慣を読み込んでいます..." />;
  if (loadError?.isNotFound || !habit) {
    return (
      <ErrorScreen
        title="習慣が見つかりません"
        message="指定された習慣は存在しないか、閲覧する権限がありません。"
      />
    );
  }
  if (loadError) {
    return (
      <ErrorScreen
        message={loadError.message}
        onRetry={() => {
          setIsLoading(true);
          setRetryCount((count) => count + 1);
        }}
      />
    );
  }

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
          <MonthlyRecordCalendar habitId={habit.id} />
          <div className="flex items-center gap-2">
            <Link
              href={`/habit/${habit.id}/edit`}
              aria-label="習慣を編集"
              className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 transition hover:text-primary"
            >
              <Pencil className="size-5" aria-hidden="true" />
            </Link>
            <Link
              href={`/record/create?habitId=${habit.id}`}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-text transition hover:bg-primary-hover"
            >
              <Plus className="size-5" aria-hidden="true" />
              記録する
            </Link>
          </div>
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

function RecordCard({ record }: { record: RecordResponse }) {
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
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex" aria-label={`レベル${level}`}>
            {Array.from({ length: level }, (_, index) => (
              <Flame
                key={index}
                className="size-5 fill-orange-400 text-orange-400"
                aria-hidden="true"
              />
            ))}
          </div>
          <Link
            href={`/record/${record.id}/edit`}
            aria-label={`${record.recordDate}の記録を編集`}
            className="rounded p-1 text-gray-500 transition hover:text-primary"
          >
            <Pencil className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
