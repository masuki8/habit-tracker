const API_BASE_URL = "/api";

type ApiFetchOptions = RequestInit & {
  token?: string;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { token, headers, ...requestOptions } = options;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const requestHeaders = new Headers(headers);

  if (requestOptions.body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...requestOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    const responseBody = await response.text();
    const errorBody = parseErrorBody(responseBody);
    throw new ApiError(
      response.status,
      errorBody.message || `API request failed (${response.status})`,
      errorBody.code,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function parseErrorBody(responseBody: string): { code?: string; message: string } {
  if (!responseBody) return { message: "" };

  try {
    const parsed = JSON.parse(responseBody) as {
      code?: string;
      message?: string;
      detail?: string;
    };
    return {
      code: parsed.code,
      message: parsed.message ?? parsed.detail ?? responseBody,
    };
  } catch {
    return { message: responseBody };
  }
}
