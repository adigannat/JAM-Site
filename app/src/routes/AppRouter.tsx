import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { ProtectedRoute } from "./ProtectedRoute";

const LandingPage = lazy(() => import("@pages/LandingPage").then(m => ({ default: m.LandingPage })));
const ScanPage = lazy(() => import("@pages/ScanPage").then(m => ({ default: m.ScanPage })));
const ProfilePage = lazy(() => import("@pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const NotFoundPage = lazy(() => import("@pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-brand-400" />
    </div>
  );
}

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <LandingPage />
          </Suspense>
        )
      },
      {
        path: "scan",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <ScanPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: "me",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        )
      }
    ]
  }
]);
