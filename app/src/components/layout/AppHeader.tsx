import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@lib/auth";
import { Button } from "@components/ui/Button";
import { clsx } from "clsx";

export function AppHeader(): JSX.Element {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-surface/70 px-6 py-4 backdrop-blur">
      <Link to="/" className="flex items-center gap-3 text-white">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white shadow-glow">
          J
        </span>
        <div>
          <p className="text-sm font-semibold leading-none tracking-wide uppercase text-white/70">
            JAM Events
          </p>
          <p className="text-base font-semibold leading-tight">Sticker Hunt</p>
        </div>
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-medium text-white/70 md:flex">
        <StyledNavLink to="/">Home</StyledNavLink>
        <StyledNavLink to="/scan">Scan</StyledNavLink>
        <StyledNavLink to="/me">My collection</StyledNavLink>
      </nav>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="hidden flex-col text-right text-xs font-medium text-white/70 sm:flex">
              <span className="truncate">{user.email}</span>
              {user.name ? <span className="text-white/50">{user.name}</span> : null}
            </div>
            <Button
              variant="ghost"
              onClick={() => void logout()}
              disabled={loading}
              className="hidden sm:inline-flex"
            >
              Sign out
            </Button>
          </>
        ) : (
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            Guest
          </p>
        )}
      </div>
    </header>
  );
}

interface StyledNavLinkProps {
  to: string;
  children: string;
}

function StyledNavLink({ to, children }: StyledNavLinkProps): JSX.Element {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "relative transition hover:text-white",
          isActive ? "text-white" : "text-white/60"
        )
      }
    >
      {({ isActive }) => (
        <>
          {children}
          <span
            className={clsx(
              "absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-brand-400 transition-opacity",
              isActive ? "opacity-100" : "opacity-0"
            )}
          />
        </>
      )}
    </NavLink>
  );
}
