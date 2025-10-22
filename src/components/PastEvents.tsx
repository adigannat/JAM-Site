"use client";

import { useEffect, useState } from "react";
import { fetchEvents, getEventImages, type Event } from "@/lib/appwrite";

export default function PastEvents() {
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetchEvents("past");
        setPastEvents(response.documents as unknown as Event[]);
      } catch (error) {
        console.error("Failed to load past events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const eventTypes = Array.from(
    new Set(pastEvents.map((event) => event.eventType))
  );

  const filteredEvents =
    filter === "all"
      ? pastEvents
      : pastEvents.filter((event) => event.eventType === filter);

  if (loading) {
    return (
      <section className="relative isolate px-6 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (pastEvents.length === 0) {
    return null;
  }

  return (
    <section
      id="past-events"
      className="relative isolate px-6 py-24 sm:px-8 lg:px-12"
    >
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-emerald-300/80">
            Our portfolio
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Past Events & Experiences
          </h2>
          <p className="mt-4 text-base text-neutral-300 sm:text-lg">
            A showcase of memorable moments we&apos;ve created for our clients
          </p>
        </div>

        {eventTypes.length > 1 && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                filter === "all"
                  ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300"
                  : "border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:text-white"
              }`}
            >
              All Events
            </button>
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                  filter === type
                    ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300"
                    : "border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const images = getEventImages(event.imageIds || []);
            const eventDate = new Date(event.date);

            return (
              <article
                key={event.$id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] transition duration-500 hover:-translate-y-2 hover:border-white/30 hover:bg-white/[0.08] hover:shadow-[0_20px_70px_-20px_rgba(52,211,153,0.3)]"
              >
                {images[0] && (
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={images[0]}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                    {event.attendees && (
                      <div className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                        {event.attendees.toLocaleString()} attendees
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <time className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">
                      {eventDate.toLocaleDateString("en-US", {
                        month: "short",
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
                  <p className="mt-2 text-sm text-neutral-300 line-clamp-3">
                    {event.description}
                  </p>

                  {event.highlights && event.highlights.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.highlights.slice(0, 3).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-neutral-400">
              No events found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
