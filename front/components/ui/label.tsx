import { ComponentProps } from "react";

type LabelProps = ComponentProps<"label">;

export function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`mb-1.5 block text-sm font-medium text-gray-700 ${className}`}
      {...props}
    />
  );
}
