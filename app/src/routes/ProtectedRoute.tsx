import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@lib/auth";
import { isDemoMode } from "@lib/env";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const { user, ready } = useAuth();
  const location = useLocation();

  // In demo mode, allow access to all pages
  if (isDemoMode) {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-brand-200">
        Checking access…
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location.pathname
        }}
      />
    );
  }

  return <>{children}</>;
}
