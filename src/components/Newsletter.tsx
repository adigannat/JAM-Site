"use client";

import { useState } from "react";
import {
  subscribeNewsletter,
  DuplicateSignupError,
  AppwriteEnvironmentError,
} from "@/lib/appwrite";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await subscribeNewsletter(email, name);
      setMessage({
        type: "success",
        text: "Welcome! Check your inbox for exclusive updates.",
      });
      setEmail("");
      setName("");
    } catch (error) {
      if (error instanceof DuplicateSignupError) {
        setMessage({
          type: "error",
          text: "You're already subscribed! Check your inbox for updates.",
        });
      } else if (error instanceof AppwriteEnvironmentError) {
        setMessage({
          type: "error",
          text: "Configuration error. Please try again later.",
        });
      } else {
        setMessage({
          type: "error",
          text: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="newsletter"
      className="relative isolate px-6 py-24 sm:px-8 lg:px-12"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[35rem] w-[35rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500/20 via-cyan-400/15 to-blue-500/20 blur-[160px]" />
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl">
          <div className="p-8 sm:p-12">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Stay connected
              </div>
              <h2 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">
                Join our inner circle
              </h2>
              <p className="mt-4 text-base text-neutral-300 sm:text-lg">
                Get early access to exclusive events, insider tips, and curated
                inspiration delivered monthly. No spam, just the good stuff.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-white placeholder-neutral-400 transition focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-white placeholder-neutral-400 transition focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Subscribing...
                  </span>
                ) : (
                  "Subscribe to our newsletter"
                )}
              </button>

              {message && (
                <div
                  className={`rounded-xl border px-6 py-4 text-sm ${
                    message.type === "success"
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                      : "border-red-400/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </form>

            <p className="mt-6 text-center text-xs text-neutral-400">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
