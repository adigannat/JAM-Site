import EventsGallery from "@/components/EventsGallery";
import PastEvents from "@/components/PastEvents";
import SignupForm from "@/components/SignupForm";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Events | JAM Events",
  description:
    "Explore our upcoming and past events. Join us for unforgettable experiences crafted with passion and precision.",
};

export default function EventsPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/3 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-purple-500/20 via-fuchsia-400/15 to-pink-500/20 blur-[180px] animate-pulse" />
        <div className="absolute right-1/4 top-1/3 h-[35rem] w-[35rem] translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-500/20 via-cyan-400/15 to-blue-500/20 blur-[160px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-x-0 bottom-0 h-[40rem] bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pb-12 pt-20 sm:px-8 sm:pb-16 sm:pt-24 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-purple-300 animate-fade-in">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
            Discover events
          </div>
          <h1 className="mt-8 bg-gradient-to-br from-white via-purple-100 to-fuchsia-200 bg-clip-text font-semibold text-5xl text-transparent leading-tight sm:text-6xl lg:text-7xl animate-fade-in-up">
            Experiences that
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-300 bg-clip-text">
              captivate & inspire
            </span>
          </h1>
          <p className="mt-6 text-lg text-neutral-300 sm:text-xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            From intimate gatherings to large-scale productions, discover the
            moments we&apos;ve crafted and the experiences waiting for you.
          </p>
        </div>
      </section>

      <EventsGallery />
      <PastEvents />
      <SignupForm />
      <Footer />
    </main>
  );
}
