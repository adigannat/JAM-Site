import { Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@lib/auth";
import { ToastProvider } from "@components/ui/Toast";
import { AppHeader } from "@components/layout/AppHeader";
import { AppFooter } from "@components/layout/AppFooter";
import { ErrorBoundary } from "@components/common/ErrorBoundary";

function RootContent(): JSX.Element {
  const { ready } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-brand-400" />
          <p className="text-sm text-white/60">Loading your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-white">
      <div className="absolute inset-x-0 top-[-300px] z-0 h-[600px] bg-[radial-gradient(circle_at_top,_rgba(90,57,244,0.35),_transparent_65%)]" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex-1">
          <Outlet />
        </div>
        <AppFooter />
      </div>
    </div>
  );
}

export function RootLayout(): JSX.Element {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <RootContent />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
