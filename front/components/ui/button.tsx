import { ComponentProps } from "react";

type ButtonVariant = "primary";

type ButtonProps = ComponentProps<"button"> & {
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-text hover:bg-primary-hover",
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
      className={`relative rounded-lg px-6 py-2.5 font-semibold text-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${className}`}
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className={isLoading ? "invisible" : undefined}>{children}</span>
      {isLoading && (
        <>
          <svg
            className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8V0A12 12 0 0 0 0 12h4Z"
            />
          </svg>
          <span className="sr-only">{loadingLabel}</span>
        </>
      )}
    </button>
  );
}
