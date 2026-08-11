"use client";

import { useEffect, useState } from "react";

import {
  clearFlashMessage,
  getFlashMessage,
  subscribeToFlashMessage,
  type FlashMessage,
} from "@/lib/flash-message";

type ToastVariant = NonNullable<FlashMessage["variant"]>;

const variantStyles: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-primary-light bg-base-white text-primary",
  error: "border-red-200 bg-red-50 text-red-700",
};

export function Toast() {
  const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null);

  useEffect(() => {
    const updateFlashMessage = () => setFlashMessage(getFlashMessage());
    updateFlashMessage();
    return subscribeToFlashMessage(updateFlashMessage);
  }, []);

  useEffect(() => {
    if (!flashMessage) return;

    const timeoutId = window.setTimeout(clearFlashMessage, 10000);
    return () => window.clearTimeout(timeoutId);
  }, [flashMessage]);

  if (!flashMessage) return null;

  const variant = flashMessage.variant ?? "info";

  return (
    <div
      className={`fixed left-4 right-4 top-24 z-50 flex items-start gap-3 rounded-lg px-5 py-4 shadow-sm sm:left-auto sm:right-5 sm:w-full sm:max-w-sm ${variantStyles[variant]}`}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <div className="min-w-0 flex-1 text-sm font-medium">
        {flashMessage.message}
      </div>
      <button
        type="button"
        className="-m-1 rounded p-1 leading-none opacity-70 transition hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current"
        aria-label="通知を閉じる"
        onClick={clearFlashMessage}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
