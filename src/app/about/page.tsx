import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Partners from "@/components/Partners";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About Us | JAM Events",
  description:
    "Meet the team behind JAM Events. Award-winning event planners and producers passionate about creating unforgettable experiences.",
};

export default function AboutPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-pink-500/20 via-fuchsia-400/15 to-purple-500/20 blur-[200px] animate-pulse" />
        <div className="absolute left-1/4 bottom-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-500/20 via-cyan-400/15 to-blue-500/20 blur-[180px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute inset-x-0 bottom-0 h-[40rem] bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pb-12 pt-20 sm:px-8 sm:pb-16 sm:pt-24 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-pink-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pink-400" />
            Our story
          </div>
          <h1 className="mt-8 bg-gradient-to-br from-white via-pink-100 to-fuchsia-200 bg-clip-text font-semibold text-5xl text-transparent leading-tight sm:text-6xl lg:text-7xl">
            Creators of moments
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-purple-300 bg-clip-text">
              that matter
            </span>
          </h1>
          <p className="mt-6 text-lg text-neutral-300 sm:text-xl">
            JAM Events was born from a simple belief: every gathering has the power
            to inspire, connect, and transform. We&apos;re a collective of creatives,
            producers, and experience designers obsessed with the details that
            matter.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative px-6 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-8 transition duration-500 hover:-translate-y-2 hover:border-white/30 hover:bg-white/[0.08]">
              <div className="pointer-events-none absolute -inset-8 z-0 rounded-[36px] opacity-0 blur-3xl transition duration-500 group-hover:opacity-100 group-hover:[background:radial-gradient(circle_at_top,_rgba(236,72,153,0.3),_transparent_65%)]" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 text-4xl">
                  🎯
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Purpose-Driven
                </h3>
                <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                  Every event we create has intention at its core—aligning with your
                  goals and resonating with your audience.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-8 transition duration-500 hover:-translate-y-2 hover:border-white/30 hover:bg-white/[0.08]">
              <div className="pointer-events-none absolute -inset-8 z-0 rounded-[36px] opacity-0 blur-3xl transition duration-500 group-hover:opacity-100 group-hover:[background:radial-gradient(circle_at_top,_rgba(168,85,247,0.3),_transparent_65%)]" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 text-4xl">
                  ✨
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Detail-Obsessed
                </h3>
                <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                  From lighting cues to napkin folds, we believe magic lives in the
                  minutiae that most people overlook.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-8 transition duration-500 hover:-translate-y-2 hover:border-white/30 hover:bg-white/[0.08]">
              <div className="pointer-events-none absolute -inset-8 z-0 rounded-[36px] opacity-0 blur-3xl transition duration-500 group-hover:opacity-100 group-hover:[background:radial-gradient(circle_at_top,_rgba(52,211,153,0.3),_transparent_65%)]" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-4xl">
                  🤝
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Partnership First
                </h3>
                <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                  You&apos;re not just a client—you&apos;re a collaborator. We succeed when
                  your vision becomes reality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Team />
      <Testimonials />
      <Partners />
      <Newsletter />
      <Footer />
    </main>
  );
}
