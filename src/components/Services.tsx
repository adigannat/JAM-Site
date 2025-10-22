const services = [
  {
    icon: "🎯",
    title: "Corporate Events",
    description:
      "Product launches, team retreats, conferences, and galas that align with your brand vision and business goals.",
    features: [
      "Product launches",
      "Team building retreats",
      "Annual conferences",
      "Awards ceremonies",
    ],
  },
  {
    icon: "💍",
    title: "Social Celebrations",
    description:
      "Weddings, milestone birthdays, and private parties designed to reflect your unique story and style.",
    features: [
      "Wedding planning & coordination",
      "Milestone celebrations",
      "Private dinners",
      "Themed parties",
    ],
  },
  {
    icon: "🎨",
    title: "Brand Activations",
    description:
      "Immersive pop-up experiences, roadshows, and influencer events that create buzz and drive engagement.",
    features: [
      "Pop-up experiences",
      "Roadshows & tours",
      "Influencer events",
      "Product sampling",
    ],
  },
  {
    icon: "🎪",
    title: "Festival Production",
    description:
      "Multi-day festivals, cultural gatherings, and outdoor events with end-to-end logistics and creative direction.",
    features: [
      "Music & arts festivals",
      "Food & wine events",
      "Community gatherings",
      "Multi-venue coordination",
    ],
  },
  {
    icon: "🎬",
    title: "Experiential Design",
    description:
      "Custom set design, interactive installations, and immersive environments that captivate every sense.",
    features: [
      "Set & stage design",
      "Interactive installations",
      "Projection mapping",
      "Sensory experiences",
    ],
  },
  {
    icon: "🎵",
    title: "Entertainment & Talent",
    description:
      "Curated entertainment, speaker booking, and talent coordination to elevate your event experience.",
    features: [
      "Live music & DJs",
      "Speaker booking",
      "Performance artists",
      "Celebrity appearances",
    ],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative isolate px-6 py-24 sm:px-8 lg:px-12"
    >
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-purple-300/80">
            What we do
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Comprehensive Event Services
          </h2>
          <p className="mt-4 text-base text-neutral-300 sm:text-lg">
            From concept to execution, we handle every detail so you can focus on
            making an impact
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <article
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-8 transition duration-500 hover:-translate-y-2 hover:border-white/30 hover:bg-white/[0.08]"
            >
              <div className="pointer-events-none absolute -inset-8 z-0 rounded-[36px] opacity-0 blur-3xl transition duration-500 group-hover:opacity-100 group-hover:[background:radial-gradient(circle_at_top,_rgba(168,85,247,0.3),_transparent_65%)]" />

              <div className="relative z-10">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 text-4xl backdrop-blur-md">
                  {service.icon}
                </div>

                <h3 className="text-xl font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-2">
                  {service.features.map((feature, featureIdx) => (
                    <li
                      key={featureIdx}
                      className="flex items-center gap-3 text-sm text-neutral-200"
                    >
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-fuchsia-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-base text-neutral-300">
            Looking for something custom?{" "}
            <a
              href="#contact"
              className="font-semibold text-fuchsia-300 transition hover:text-fuchsia-200"
            >
              Let&apos;s talk about your vision
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
