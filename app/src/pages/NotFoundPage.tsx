import { Link } from "react-router-dom";

export function NotFoundPage(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <h1 className="text-4xl font-semibold text-white">Page not found</h1>
      <p className="max-w-md text-white/70">
        We couldn&apos;t find the page you were looking for. Return home to continue
        the sticker hunt.
      </p>
      <Link
        to="/"
        className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-200"
      >
        Back to home
      </Link>
    </main>
  );
}
