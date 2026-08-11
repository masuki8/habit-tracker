import { ComponentProps } from "react";

type ErrorMessageProps = ComponentProps<"p">;

export function ErrorMessage({
  className = "",
  role = "alert",
  ...props
}: ErrorMessageProps) {
  return (
    <p
      className={`rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700 ${className}`}
      role={role}
      {...props}
    />
  );
}
