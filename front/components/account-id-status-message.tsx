import type { AccountIdStatus } from "@/hooks/use-account-id-availability";

const MESSAGES: Record<AccountIdStatus, { text: string; className: string }> = {
  idle: { text: "3〜30文字の半角英数字とアンダースコアが使えます", className: "text-gray-500" },
  invalidLength: { text: "3文字以上30文字以下で入力してください", className: "text-red-600" },
  invalidPattern: { text: "半角英数字とアンダースコアを使用してください", className: "text-red-600" },
  checking: { text: "使用できるか確認しています...", className: "text-gray-500" },
  available: { text: "このアカウントIDは使用できます", className: "text-green-700" },
  taken: { text: "このアカウントIDはすでに使用されています", className: "text-red-600" },
  error: { text: "確認できませんでした。入力し直してください", className: "text-red-600" },
};

export function AccountIdStatusMessage({ status }: { status: AccountIdStatus }) {
  const message = MESSAGES[status];
  return (
    <p id="account-id-status" className={`mt-1 text-xs ${message.className}`} aria-live="polite">
      {message.text}
    </p>
  );
}
