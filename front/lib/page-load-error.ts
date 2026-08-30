import { ApiError } from "./api";

export type PageLoadError = {
  isNotFound: boolean;
  message: string;
};

export function toPageLoadError(error: unknown, fallback: string): PageLoadError {
  return {
    isNotFound: error instanceof ApiError && error.status === 404,
    message: error instanceof Error && error.message ? error.message : fallback,
  };
}
