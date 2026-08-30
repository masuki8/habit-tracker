"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import {
  ACCOUNT_ID_MAX_LENGTH,
  ACCOUNT_ID_MIN_LENGTH,
  ACCOUNT_ID_PATTERN,
  normalizeAccountId,
} from "@/lib/account-id";

export type AccountIdStatus =
  | "idle"
  | "invalidLength"
  | "invalidPattern"
  | "checking"
  | "available"
  | "taken"
  | "error";

type AvailabilityResult = {
  accountId: string;
  status: "available" | "taken" | "error";
};

export function useAccountIdAvailability({
  accountId,
  endpoint,
  initialAccountId = "",
  token,
}: {
  accountId: string;
  endpoint: string;
  initialAccountId?: string;
  token?: string;
}) {
  const normalizedAccountId = normalizeAccountId(accountId);
  const localStatus = getLocalStatus(normalizedAccountId, initialAccountId);
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const status: AccountIdStatus =
    localStatus ??
    (result?.accountId === normalizedAccountId ? result.status : "checking");

  useEffect(() => {
    if (localStatus !== null) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await apiFetch<{ available: boolean }>(
          `${endpoint}?accountId=${encodeURIComponent(normalizedAccountId)}`,
          { token, signal: controller.signal },
        );
        setResult({
          accountId: normalizedAccountId,
          status: response.available ? "available" : "taken",
        });
      } catch {
        if (!controller.signal.aborted) {
          setResult({ accountId: normalizedAccountId, status: "error" });
        }
      }
    }, 400);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [endpoint, localStatus, normalizedAccountId, token]);

  return { normalizedAccountId, status };
}

function getLocalStatus(
  accountId: string,
  initialAccountId: string,
): AccountIdStatus | null {
  if (!accountId) return "idle";
  if (
    accountId.length < ACCOUNT_ID_MIN_LENGTH ||
    accountId.length > ACCOUNT_ID_MAX_LENGTH
  ) {
    return "invalidLength";
  }
  if (!ACCOUNT_ID_PATTERN.test(accountId)) return "invalidPattern";
  if (accountId === normalizeAccountId(initialAccountId)) return "available";
  return null;
}
