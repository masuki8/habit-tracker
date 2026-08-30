import { LoaderCircle } from "lucide-react";

export function LoadingScreen({ message = "読み込んでいます..." }: { message?: string }) {
  return (
    <div
      className="flex min-h-64 w-full flex-col items-center justify-center gap-4 rounded-lg bg-surface px-6 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="size-9 animate-spin text-primary" aria-hidden="true" />
      <div>
        <p className="font-semibold text-gray-800">{message}</p>
        <p className="mt-1 text-sm text-gray-500">少しだけお待ちください</p>
      </div>
    </div>
  );
}
