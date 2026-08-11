const ACCESS_TOKEN_KEY = "accessToken";
const ACCESS_TOKEN_EXPIRES_AT_KEY = "accessTokenExpiresAt";

export function saveSession(accessToken: string, expiresInSeconds: number) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(
    ACCESS_TOKEN_EXPIRES_AT_KEY,
    String(Date.now() + expiresInSeconds * 1000),
  );
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
}

export function hasValidSession() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const expiresAt = Number(localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY));

  return (
    Boolean(accessToken) && Number.isFinite(expiresAt) && expiresAt > Date.now()
  );
}
