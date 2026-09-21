import { ComponentProps } from "react";

type FormCardProps = ComponentProps<"div">;

export function FormCard({ className = "", ...props }: FormCardProps) {
  return (
    <div
      className={`rounded-2xl border border-black/5 bg-surface px-5 py-6 shadow-[0_8px_30px_rgba(29,29,29,0.05)] sm:px-8 sm:py-8 ${className}`}
      {...props}
    />
  );
}
