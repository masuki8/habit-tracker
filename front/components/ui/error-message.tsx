import { ComponentProps } from "react";

type ErrorMessageProps = ComponentProps<"p">;

export function ErrorMessage({
  className = "",
  role = "alert",
  ...props
}: ErrorMessageProps) {
  return (
    <p
      className={`rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`}
      role={role}
      {...props}
    />
  );
}
