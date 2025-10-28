import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  icon?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, hint, icon, error, className, type = "text", ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="block text-left">
        <div className="mb-1 flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-white/60">
          <span>{label}</span>
          {hint ? <span className="text-white/40">{hint}</span> : null}
        </div>
        <div className="relative">
          {icon ? (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-white/40">
              {icon}
            </span>
          ) : null}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={clsx(
              "w-full rounded-xl border border-white/10 bg-surface-muted/80 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-400/40",
              icon && "pl-11",
              error && "border-danger focus:border-danger focus:ring-danger/30",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1 text-xs font-medium text-danger">{error}</p>
        ) : null}
      </label>
    );
  }
);

Input.displayName = "Input";
