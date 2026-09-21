import { CircleAlert, RotateCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "./button";

type ErrorScreenProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorScreen({
  title = "エラーが発生しました",
  message = "画面を表示できませんでした。時間をおいて、もう一度お試しください。",
  onRetry,
}: ErrorScreenProps) {
  return (
    <div
      className="flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border border-black/5 bg-surface px-6 py-12 text-center shadow-[0_8px_30px_rgba(29,29,29,0.04)]"
      role="alert"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <CircleAlert className="size-7" aria-hidden="true" />
      </div>
      <h2 className="mt-5">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">{message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRetry && (
          <Button type="button" onClick={onRetry} className="inline-flex items-center gap-2">
            <RotateCcw className="size-4" aria-hidden="true" />
            もう一度試す
          </Button>
        )}
        <Link
          href="/"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  );
}
