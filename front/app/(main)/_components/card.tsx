import { ComponentProps } from "react";

type CardProps = ComponentProps<"div">;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`w-full rounded-2xl border border-black/5 bg-surface px-5 py-5 shadow-[0_8px_30px_rgba(29,29,29,0.04)] sm:px-7 ${className}`}
      {...props}
    />
  );
}
