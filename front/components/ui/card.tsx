import { ComponentProps } from "react";

type CardProps = ComponentProps<"div">;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`w-lg rounded-lg bg-surface px-15 py-10 ${className}`}
      {...props}
    />
  );
}
