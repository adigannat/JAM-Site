"use client";

import { useEffect, useState } from "react";
import { fetchTestimonials, getImageUrl, teamBucketId, type Testimonial } from "@/lib/appwrite";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await fetchTestimonials(true);
        setTestimonials(response.documents as unknown as Testimonial[]);
      } catch (error) {
        console.error("Failed to load testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="relative isolate px-6 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-5 w-5 ${i < rating ? "text-amber-400" : "text-neutral-600"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section
      id="testimonials"
      className="relative isolate px-6 py-24 sm:px-8 lg:px-12"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-500/20 via-fuchsia-400/15 to-pink-500/20 blur-[180px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-pink-300/80">
            Client stories
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Trusted by industry leaders
          </h2>
          <p className="mt-4 text-base text-neutral-300 sm:text-lg">
            Hear from the brands and teams who&apos;ve partnered with JAM to create
            memorable experiences
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.$id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur-md transition duration-300 hover:border-white/30 hover:bg-white/[0.12]"
            >
              <div className="pointer-events-none absolute -inset-8 z-0 rounded-[36px] opacity-0 blur-3xl transition duration-500 group-hover:opacity-100 group-hover:[background:radial-gradient(circle_at_bottom,_rgba(236,72,153,0.3),_transparent_70%)]" />

              <div className="relative z-10">
                {renderStars(testimonial.rating)}

                <p className="mt-4 text-sm text-neutral-200 leading-relaxed">
                  &quot;{testimonial.testimonial}&quot;
                </p>

                <div className="mt-6 flex items-center gap-4">
                  {testimonial.imageId && teamBucketId && (
                    <img
                      src={getImageUrl(teamBucketId, testimonial.imageId)}
                      alt={testimonial.clientName}
                      className="h-12 w-12 rounded-full border border-white/20 object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.clientName}
                    </p>
                    {testimonial.clientRole && (
                      <p className="text-xs text-neutral-400">
                        {testimonial.clientRole}
                        {testimonial.companyName &&
                          `, ${testimonial.companyName}`}
                      </p>
                    )}
                  </div>
                </div>

                {testimonial.eventType && (
                  <div className="mt-4 inline-flex rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80">
                    {testimonial.eventType}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
