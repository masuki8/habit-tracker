import { ComponentProps } from "react";

type TextareaProps = ComponentProps<"textarea">;

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`form-control min-h-28 resize-y ${className}`}
      {...props}
    />
  );
}
