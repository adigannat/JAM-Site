const partners = [
  { name: "TechCorp", category: "Technology" },
  { name: "LuxuryBrand Co", category: "Luxury Goods" },
  { name: "Global Finance", category: "Financial Services" },
  { name: "Creative Agency", category: "Marketing" },
  { name: "Startup Inc", category: "Tech Startup" },
  { name: "Fashion House", category: "Fashion" },
  { name: "Innovation Labs", category: "R&D" },
  { name: "Media Group", category: "Media" },
];

export default function Partners() {
  return (
    <section className="relative isolate px-6 py-24 sm:px-8 lg:px-12">
      <div className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-neutral-900 via-neutral-900/30 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-purple-300/80">
            Trusted partners
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Brands we&apos;ve collaborated with
          </h2>
          <p className="mt-4 text-base text-neutral-300 sm:text-lg">
            From innovative startups to Fortune 500 companies, we&apos;ve helped
            diverse clients create memorable moments
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-8 transition duration-300 hover:border-white/30 hover:bg-white/[0.08]"
            >
              <div className="pointer-events-none absolute -inset-8 z-0 rounded-[36px] opacity-0 blur-3xl transition duration-500 group-hover:opacity-100 group-hover:[background:radial-gradient(circle_at_center,_rgba(168,85,247,0.2),_transparent_65%)]" />

              <div className="relative z-10 text-center">
                {/* Placeholder for logo - replace with actual images from Appwrite Storage */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 text-2xl font-bold text-white/40">
                  {partner.name.charAt(0)}
                </div>
                <p className="font-semibold text-white text-sm">
                  {partner.name}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  {partner.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-8 text-center backdrop-blur-md sm:p-12">
          <p className="text-2xl font-semibold text-white sm:text-3xl">
            Ready to join our roster of satisfied clients?
          </p>
          <p className="mt-4 text-base text-neutral-300">
            Let&apos;s discuss how JAM can elevate your next event
          </p>
          <a
            href="#contact"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 px-8 py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:scale-[1.02] hover:shadow-pink-500/40"
          >
            Start a conversation
          </a>
        </div>
      </div>
    </section>
  );
}
