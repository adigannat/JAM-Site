"use client";

import { useEffect, useState } from "react";
import { fetchEvents, getEventImages, type Event } from "@/lib/appwrite";
import Link from "next/link";

export default function EventsGallery() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetchEvents("upcoming");
        setUpcomingEvents(response.documents as unknown as Event[]);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <section className="relative isolate px-6 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <section
      id="events"
      className="relative isolate px-6 py-24 sm:px-8 lg:px-12"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-neutral-900 via-neutral-900/40 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-fuchsia-300/80">
            Coming soon
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Upcoming Events
          </h2>
          <p className="mt-4 text-base text-neutral-300 sm:text-lg">
            Join us for unforgettable experiences crafted with passion and
            precision
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => {
            const images = getEventImages(event.imageIds || []);
            const eventDate = new Date(event.date);
            const spotsLeft =
              event.maxAttendees && event.attendees
                ? event.maxAttendees - event.attendees
                : null;

            return (
              <article
                key={event.$id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] transition duration-500 hover:-translate-y-2 hover:border-white/30 hover:bg-white/[0.08] hover:shadow-[0_20px_70px_-20px_rgba(236,72,153,0.4)]"
              >
                {images[0] && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={images[0]}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                    {spotsLeft !== null && spotsLeft < 10 && (
                      <div className="absolute right-4 top-4 rounded-full border border-amber-400/30 bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-200 backdrop-blur-md">
                        Only {spotsLeft} spots left
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <time className="text-xs uppercase tracking-[0.35em] text-fuchsia-300/80">
                      {eventDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                      {event.location}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-300 line-clamp-2">
                    {event.description}
                  </p>

                  {event.highlights && event.highlights.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.highlights.slice(0, 3).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between">
                    {event.price !== undefined && (
                      <span className="text-lg font-semibold text-white">
                        {event.price === 0
                          ? "Free"
                          : `$${event.price.toLocaleString()}`}
                      </span>
                    )}
                    <Link
                      href="#signup"
                      className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-300 transition hover:text-fuchsia-200"
                    >
                      Register
                      <svg
                        className="h-4 w-4 transition group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
