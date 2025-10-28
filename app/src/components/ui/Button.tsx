import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", fullWidth, loading, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        fullWidth && "w-full",
        getVariantClasses(variant),
        loading && "cursor-wait opacity-75",
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-transparent" /> : null}
      {children}
    </button>
  )
);

Button.displayName = "Button";

function getVariantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "secondary":
      return "bg-white/10 text-white hover:bg-white/15 focus-visible:outline-brand-200";
    case "ghost":
      return "bg-transparent text-white hover:bg-white/10 focus-visible:outline-brand-200";
    default:
      return "bg-brand-500 text-white shadow-glow hover:bg-brand-400 focus-visible:outline-brand-200";
  }
}
