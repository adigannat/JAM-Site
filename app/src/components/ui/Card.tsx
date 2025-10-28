import { PropsWithChildren } from "react";
import { clsx } from "clsx";

interface CardProps extends PropsWithChildren {
  bordered?: boolean;
  className?: string;
}

export function Card({
  children,
  bordered = true,
  className
}: CardProps): JSX.Element {
  return (
    <div
      className={clsx(
        "rounded-3xl bg-white/[0.03] p-6 shadow-card backdrop-blur",
        bordered && "border border-white/10",
        className
      )}
    >
      {children}
    </div>
  );
}
