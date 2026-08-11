import { ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";

type ButtonVariant = "primary" | "simple";

type ButtonProps = ComponentProps<"button"> & {
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "rounded-lg px-6 py-2.5 bg-primary text-primary-text font-semibold hover:bg-primary-hover",
  simple: "rounded px-2 py-0.5 text-primary hover:text-gray-600",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  disabled,
  isLoading = false,
  loadingLabel = "処理中",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`relative text-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${className}`}
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className={isLoading ? "invisible" : undefined}>{children}</span>
      {isLoading && (
        <>
          <LoaderCircle
            className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 animate-spin"
            aria-hidden="true"
          />
          <span className="sr-only">{loadingLabel}</span>
        </>
      )}
    </button>
  );
}
