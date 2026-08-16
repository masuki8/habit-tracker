import { ComponentProps } from "react";

type FormCardProps = ComponentProps<"div">;

export function FormCard({ className = "", ...props }: FormCardProps) {
  return (
    <div
      className={`rounded-lg bg-surface px-15 py-10 ${className}`}
      {...props}
    />
  );
}
