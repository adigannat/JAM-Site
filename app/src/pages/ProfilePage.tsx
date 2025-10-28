import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@components/ui/Button";
import { Card } from "@components/ui/Card";
import { useAuth } from "@lib/auth";
import { fetchUserClaims, UserClaim } from "@lib/claims";
import { formatClaimedDate } from "@lib/format";

export function ProfilePage(): JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState<UserClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClaims = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUserClaims(user.id);
      setClaims(result);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your sticker history."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    void loadClaims();
  }, [loadClaims, navigate, user]);

  const rarityGrouping = useMemo(() => {
    const groups = new Map<string, number>();
    for (const claim of claims) {
      const rarity = claim.stickerRarity ?? "Standard";
      groups.set(rarity, (groups.get(rarity) ?? 0) + 1);
    }
    return Array.from(groups.entries());
  }, [claims]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">
          Collection
        </p>
        <h1 className="text-3xl font-semibold text-white">
          {user ? `${user.name ?? "Your"} sticker vault` : "Sticker vault"}
        </h1>
        <p className="text-sm text-white/60">
          Track every claim you have made during the event, including rarity and
          timestamps synced from Appwrite.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {loading ? (
          <>
            <Card className="space-y-3 animate-pulse">
              <div className="h-3 w-16 rounded-full bg-white/10" />
              <div className="h-9 w-12 rounded-full bg-white/10" />
              <div className="h-3 w-full rounded-full bg-white/10" />
            </Card>
            <Card className="space-y-3 md:col-span-2 animate-pulse">
              <div className="h-3 w-16 rounded-full bg-white/10" />
              <div className="flex flex-wrap gap-3">
                <div className="h-10 w-28 rounded-full bg-white/10" />
                <div className="h-10 w-32 rounded-full bg-white/10" />
                <div className="h-10 w-24 rounded-full bg-white/10" />
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Total</p>
              <p className="text-3xl font-semibold text-white">{claims.length}</p>
              <p className="text-xs text-white/40">
                Stickers secured via the claim function.
              </p>
            </Card>
            <Card className="space-y-3 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Rarity</p>
              <div className="flex flex-wrap gap-3">
                {rarityGrouping.length ? (
                  rarityGrouping.map(([rarity, count]) => (
                    <span
                      key={rarity}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70"
                    >
                      <span className="inline-flex h-2 w-2 rounded-full bg-brand-400" />
                      {rarity} · {count}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-white/60">
                    Claim stickers to see rarity distribution.
                  </p>
                )}
              </div>
            </Card>
          </>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Latest claims</h2>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => void loadClaims()} loading={loading}>
              Refresh
            </Button>
            <Button variant="ghost" onClick={() => navigate("/scan")}>
              Go to scanner
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <ClaimSkeleton key={index} />)
            : claims.length
              ? claims.map((claim) => <ClaimCard key={claim.id} claim={claim} />)
              : (
                <Card className="md:col-span-2">
                  <p className="text-sm text-white/60">
                    No stickers yet. Visit the{" "}
                    <Link to="/scan" className="text-brand-200 underline">
                      scanner
                    </Link>{" "}
                    to claim your first sticker.
                  </p>
                </Card>
                )}
        </div>
        {error ? (
          <p className="text-sm font-medium text-danger">{error}</p>
        ) : null}
      </section>
    </main>
  );
}

function ClaimCard({ claim }: { claim: UserClaim }): JSX.Element {
  return (
    <Card className="flex flex-col gap-4 border-white/10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-white">
            {claim.stickerName ?? "Sticker"}
          </p>
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">
            {claim.eventId}
          </p>
        </div>
        {claim.stickerRarity ? (
          <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-success">
            {claim.stickerRarity}
          </span>
        ) : null}
      </div>
      <dl className="space-y-2 text-sm text-white/70">
        <div className="flex items-center justify-between">
          <dt className="text-white/40">Code</dt>
          <dd className="font-mono text-sm text-white">{claim.code}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-white/40">Claimed</dt>
          <dd>{formatClaimedDate(claim.claimedAt)}</dd>
        </div>
      </dl>
    </Card>
  );
}

function ClaimSkeleton(): JSX.Element {
  return (
    <Card className="animate-pulse space-y-4 border-white/5">
      <div className="h-5 w-2/3 rounded-full bg-white/10" />
      <div className="space-y-3">
        <div className="h-4 w-1/2 rounded-full bg-white/10" />
        <div className="h-4 w-1/3 rounded-full bg-white/10" />
      </div>
      <div className="h-3 w-full rounded-full bg-white/10" />
    </Card>
  );
}
