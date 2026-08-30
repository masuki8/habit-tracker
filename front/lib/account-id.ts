export const ACCOUNT_ID_MIN_LENGTH = 3;
export const ACCOUNT_ID_MAX_LENGTH = 30;
export const ACCOUNT_ID_PATTERN = /^[a-z0-9_]+$/;

export function normalizeAccountId(accountId: string) {
  return accountId.trim().toLowerCase();
}
