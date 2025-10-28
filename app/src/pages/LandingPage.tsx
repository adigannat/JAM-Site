import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@components/auth/AuthForm";
import { Button } from "@components/ui/Button";
import { Card } from "@components/ui/Card";
import { useAuth } from "@lib/auth";

const highlightPoints = [
  {
    title: "Instant QR claiming",
    description:
      "Scan limited stickers around the venue to unlock exclusive merch drops."
  },
  {
    title: "Progressive tiers",
    description:
      "Collect rare stickers to level up your profile and unlock backstage access."
  },
  {
    title: "Live leaderboard",
    description:
      "See how your crew ranks in real time and challenge other teams onsite."
  }
];

const timelineSteps = [
  "Sign in on arrival",
  "Scan any sticker you discover",
  "Claim instantly through the secure function",
  "Show your collection at the prize desk"
];

export function LandingPage(): JSX.Element {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && user) {
      navigate("/scan", { replace: true });
    }
  }, [navigate, ready, user]);

  return (
    <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col gap-20 px-6 py-16 md:flex-row md:items-start md:py-24">
      <div className="flex-1 space-y-10">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">
            JAM 2025 — Sticker Hunt
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
            Claim every sticker. <br className="hidden md:block" />
            Unlock them at the Sticker Event Booth.
          </h1>
          <p className="max-w-xl text-lg text-white/70">
            A pixel-perfect, Appwrite powered experience built for reliability. Seamless
            auth, fast QR scans, and one secure function to track each claim.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button onClick={() => navigate("/scan")} disabled={!user}>
              {user ? "Open scanner" : "Sign in to start"}
            </Button>
            <p className="text-sm text-white/50">
              {user ? "Continue your hunt in seconds." : "No account yet? Use the form to join."}
            </p>
          </div>
        </div>

        <section>
          <div className="grid gap-4 md:grid-cols-3">
            {highlightPoints.map((point) => (
              <Card key={point.title} className="h-full space-y-3 border-white/5">
                <h3 className="text-lg font-semibold text-white">{point.title}</h3>
                <p className="text-sm text-white/60">{point.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-white">How it works</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {timelineSteps.map((step, index) => (
              <Card
                key={step}
                bordered={false}
                className="bg-white/[0.04] p-5 shadow-none"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-brand-200">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium text-white/80">{step}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <aside className="mx-auto w-full max-w-md md:sticky md:top-24">
        <AuthForm />
      </aside>
    </main>
  );
}
