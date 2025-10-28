import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { TOAST_DURATION_DEFAULT } from "@lib/constants";

type ToastVariant = "success" | "error" | "info";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  notify: (options: ToastOptions) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: PropsWithChildren): JSX.Element {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const counter = useRef(0);
  const timeoutsRef = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((entries) => entries.filter((toast) => toast.id !== id));
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (options: ToastOptions) => {
      const id = ++counter.current;
      const toast: ToastEntry = {
        id,
        ...options,
        variant: options.variant ?? "info",
        duration: options.duration ?? TOAST_DURATION_DEFAULT
      };

      setToasts((entries) => [...entries, toast]);

      const timeoutId = window.setTimeout(() => {
        dismiss(id);
      }, toast.duration);

      timeoutsRef.current.set(id, timeoutId);
    },
    [dismiss]
  );

  // Cleanup all timeouts on unmount
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      notify,
      dismiss
    }),
    [notify, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center gap-3 px-4 py-6 sm:items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto w-full max-w-sm rounded-2xl border border-white/10 bg-surface-subtle/95 p-4 shadow-card backdrop-blur transition"
            role={toast.variant === "error" ? "alert" : "status"}
            aria-live={toast.variant === "error" ? "assertive" : "polite"}
          >
            <div className="flex items-start gap-3">
              <span
                className={getVariantDotClasses(toast.variant ?? "info")}
                aria-hidden
              />
              <div className="space-y-1 text-left">
                <p className="text-sm font-semibold text-white">{toast.title}</p>
                {toast.description ? (
                  <p className="text-xs text-white/70">{toast.description}</p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function getVariantDotClasses(variant: ToastVariant): string {
  const base = "mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full";
  switch (variant) {
    case "success":
      return `${base} bg-success`;
    case "error":
      return `${base} bg-danger`;
    default:
      return `${base} bg-brand-300`;
  }
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
