"use client";

import { useState } from "react";
import {
  submitInquiry,
  AppwriteEnvironmentError,
} from "@/lib/appwrite";

const eventTypes = [
  "Corporate Event",
  "Wedding",
  "Birthday Party",
  "Brand Activation",
  "Festival",
  "Product Launch",
  "Conference",
  "Other",
];

const budgetRanges = [
  "Under $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+",
  "Not sure yet",
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    budget: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        eventType: formData.eventType,
        eventDate: formData.eventDate || undefined,
        guestCount: formData.guestCount ? parseInt(formData.guestCount) : undefined,
        budget: formData.budget || undefined,
        message: formData.message,
      });

      setMessage({
        type: "success",
        text: "Thank you! We'll be in touch within 24 hours to discuss your vision.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        eventDate: "",
        guestCount: "",
        budget: "",
        message: "",
      });
    } catch (error) {
      if (error instanceof AppwriteEnvironmentError) {
        setMessage({
          type: "error",
          text: "Configuration error. Please try again later.",
        });
      } else {
        setMessage({
          type: "error",
          text: "Something went wrong. Please try again or email us directly.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative isolate px-6 py-24 sm:px-8 lg:px-12"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-neutral-900 via-neutral-900/40 to-transparent" />

      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-fuchsia-300/80">
            Get in touch
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Let&apos;s create something extraordinary
          </h2>
          <p className="mt-4 text-base text-neutral-300 sm:text-lg">
            Tell us about your vision and we&apos;ll craft a tailored proposal that
            brings it to life
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="p-8 sm:p-12">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Full name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-neutral-400 transition focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                  placeholder="Jane Smith"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Email address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-neutral-400 transition focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                  placeholder="jane@company.com"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-neutral-400 transition focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label
                  htmlFor="eventType"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Event type *
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white transition focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                >
                  <option value="" className="bg-neutral-900">
                    Select an event type
                  </option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type} className="bg-neutral-900">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="eventDate"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Preferred date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white transition focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                />
              </div>

              <div>
                <label
                  htmlFor="guestCount"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Expected guests
                </label>
                <input
                  type="number"
                  id="guestCount"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  min="1"
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-neutral-400 transition focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                  placeholder="50"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="budget"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Budget range
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white transition focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                >
                  <option value="" className="bg-neutral-900">
                    Select a budget range (optional)
                  </option>
                  {budgetRanges.map((range) => (
                    <option key={range} value={range} className="bg-neutral-900">
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Tell us about your vision *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-neutral-400 transition focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/20"
                  placeholder="Describe your event vision, goals, and any special requirements..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 px-8 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:scale-[1.02] hover:shadow-fuchsia-500/40 disabled:cursor-not-allowed disabled:opacity-60"
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
                  Sending...
                </span>
              ) : (
                "Send inquiry"
              )}
            </button>

            {message && (
              <div
                className={`mt-6 rounded-xl border px-6 py-4 text-sm ${
                  message.type === "success"
                    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                    : "border-red-400/30 bg-red-500/10 text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-neutral-400">
            Prefer to email directly?{" "}
            <a
              href="mailto:hello@jamevents.com"
              className="font-semibold text-fuchsia-300 transition hover:text-fuchsia-200"
            >
              hello@jamevents.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
