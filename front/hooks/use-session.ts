"use client";

import { useSyncExternalStore } from "react";

import { hasValidSession } from "@/lib/auth-session";

const subscribe = () => () => {};

export function useSession() {
  return useSyncExternalStore<boolean | null>(
    subscribe,
    hasValidSession,
    () => null,
  );
}
