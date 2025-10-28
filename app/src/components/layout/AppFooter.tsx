export function AppFooter(): JSX.Element {
  return (
    <footer className="border-t border-white/5 bg-surface-muted/60 px-6 py-10 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-center text-sm text-white/50 sm:flex-row sm:text-left">
        <p>© {new Date().getFullYear()} JAM Events. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a
            href="mailto:events@jam.dev"
            className="transition hover:text-white"
          >
            events@jam.dev
          </a>
          <a href="https://jam.dev" className="transition hover:text-white">
            jam.dev
          </a>
        </div>
      </div>
    </footer>
  );
}
