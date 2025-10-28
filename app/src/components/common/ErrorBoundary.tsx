import { Component, ErrorInfo, PropsWithChildren, ReactNode } from "react";
import { Button } from "@components/ui/Button";
import { Card } from "@components/ui/Card";

interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center px-6">
          <Card className="max-w-md space-y-6 text-center">
            <div className="space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
                <svg
                  className="h-8 w-8 text-danger"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
              <p className="text-sm text-white/60">
                We encountered an unexpected error. Try reloading the page or contact support if
                the issue persists.
              </p>
              {this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-xs text-white/40 hover:text-white/60">
                    Technical details
                  </summary>
                  <pre className="mt-2 overflow-auto rounded-lg bg-black/30 p-3 text-xs text-white/70">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Try again
              </Button>
              <Button variant="ghost" fullWidth onClick={() => window.location.href = "/"}>
                Go home
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
