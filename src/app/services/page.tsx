import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Services | JAM Events",
  description:
    "Comprehensive event planning and production services. From corporate events to weddings, brand activations to festivals.",
};

export default function ServicesPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[45rem] w-[45rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-500/20 via-cyan-400/15 to-blue-500/20 blur-[200px] animate-pulse" />
        <div className="absolute right-1/3 top-1/2 h-[40rem] w-[40rem] translate-x-1/2 rounded-full bg-gradient-to-br from-pink-500/20 via-fuchsia-400/15 to-purple-500/20 blur-[180px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-x-0 bottom-0 h-[40rem] bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pb-12 pt-20 sm:px-8 sm:pb-16 sm:pt-24 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            What we do
          </div>
          <h1 className="mt-8 bg-gradient-to-br from-white via-emerald-100 to-cyan-200 bg-clip-text font-semibold text-5xl text-transparent leading-tight sm:text-6xl lg:text-7xl">
            Full-service event
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-300 bg-clip-text">
              planning & production
            </span>
          </h1>
          <p className="mt-6 text-lg text-neutral-300 sm:text-xl">
            From concept to execution, we handle every detail so you can focus on
            making an impact. Discover our comprehensive suite of event services.
          </p>
        </div>
      </section>

      <Services />
      <Testimonials />

      {/* CTA Section */}
      <section className="relative px-6 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 p-12 backdrop-blur-2xl">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Ready to bring your vision to life?
            </h2>
            <p className="mt-4 text-base text-neutral-300 sm:text-lg">
              Let&apos;s discuss your event and create something extraordinary together.
            </p>
            <a
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-105 hover:shadow-emerald-500/50"
            >
              Start a project
              <svg
                className="h-5 w-5"
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
            </a>
          </div>
        </div>
      </section>

      <ContactForm />
      <Footer />
    </main>
  );
}
