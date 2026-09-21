import { ComponentProps } from "react";

type LabelProps = ComponentProps<"label">;

export function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`mb-2 block text-sm font-bold text-ink-brown ${className}`}
      {...props}
    />
  );
}
