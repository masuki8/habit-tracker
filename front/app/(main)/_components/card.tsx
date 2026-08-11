import { ComponentProps } from "react";

type CardProps = ComponentProps<"div">;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`w-full rounded-lg bg-surface px-8 py-5 ${className}`}
      {...props}
    />
  );
}
