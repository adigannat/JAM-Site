import ContactForm from "@/components/ContactForm";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact Us | JAM Events",
  description:
    "Get in touch with JAM Events. Let's discuss your vision and create something extraordinary together.",
};

export default function ContactPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/3 top-0 h-[45rem] w-[45rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-400/15 to-purple-500/20 blur-[200px] animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 h-[40rem] w-[40rem] translate-x-1/2 rounded-full bg-gradient-to-br from-fuchsia-500/20 via-pink-400/15 to-rose-500/20 blur-[180px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-x-0 bottom-0 h-[40rem] bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pb-12 pt-20 sm:px-8 sm:pb-16 sm:pt-24 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-cyan-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            Let&apos;s connect
          </div>
          <h1 className="mt-8 bg-gradient-to-br from-white via-cyan-100 to-blue-200 bg-clip-text font-semibold text-5xl text-transparent leading-tight sm:text-6xl lg:text-7xl">
            Start your next
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-300 bg-clip-text">
              unforgettable event
            </span>
          </h1>
          <p className="mt-6 text-lg text-neutral-300 sm:text-xl">
            Whether you have a detailed vision or just a spark of an idea, we&apos;re
            here to help bring it to life. Share your thoughts with us and let&apos;s
            create something extraordinary together.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center transition duration-300 hover:border-white/30 hover:bg-white/[0.08]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-2xl transition group-hover:scale-110">
                📧
              </div>
              <h3 className="font-semibold text-white">Email Us</h3>
              <a
                href="mailto:hello@jamevents.com"
                className="mt-2 block text-sm text-neutral-300 transition hover:text-cyan-300"
              >
                hello@jamevents.com
              </a>
            </div>

            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center transition duration-300 hover:border-white/30 hover:bg-white/[0.08]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 text-2xl transition group-hover:scale-110">
                📱
              </div>
              <h3 className="font-semibold text-white">Call Us</h3>
              <a
                href="tel:+15551234567"
                className="mt-2 block text-sm text-neutral-300 transition hover:text-fuchsia-300"
              >
                +1 (555) 123-4567
              </a>
            </div>

            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center transition duration-300 hover:border-white/30 hover:bg-white/[0.08]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 text-2xl transition group-hover:scale-110">
                📍
              </div>
              <h3 className="font-semibold text-white">Visit Us</h3>
              <p className="mt-2 text-sm text-neutral-300">
                New York, Los Angeles
                <br />
                London, Barcelona
              </p>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />

      {/* FAQ Section */}
      <section className="relative px-6 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-base text-neutral-300 sm:text-lg">
              Quick answers to common questions about working with JAM Events
            </p>
          </div>

          <div className="mt-12 space-y-6">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6">
              <h3 className="font-semibold text-white text-lg">
                How far in advance should I book?
              </h3>
              <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                We recommend booking 6-12 months in advance for large events and
                3-6 months for smaller gatherings. However, we&apos;ve pulled off
                incredible events with shorter timelines—reach out and let&apos;s discuss
                what&apos;s possible.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6">
              <h3 className="font-semibold text-white text-lg">
                What&apos;s included in your services?
              </h3>
              <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                Our full-service approach covers everything from initial concept and
                design through to on-site coordination and post-event analysis. We
                also offer à la carte services if you only need specific support.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6">
              <h3 className="font-semibold text-white text-lg">
                Do you work with all budgets?
              </h3>
              <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                We tailor our services to match your budget and goals. During our
                initial consultation, we&apos;ll discuss what&apos;s possible and create a
                custom proposal that maximizes impact within your investment range.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6">
              <h3 className="font-semibold text-white text-lg">
                What locations do you serve?
              </h3>
              <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                We&apos;re based in New York and Los Angeles with teams in London and
                Barcelona, but we&apos;ve produced events across 24 cities worldwide. If
                you have a location in mind, we&apos;ll make it happen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}
