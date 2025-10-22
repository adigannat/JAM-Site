const teamMembers = [
  {
    name: "Alexandra Rivera",
    role: "Founder & Creative Director",
    bio: "15+ years crafting unforgettable brand experiences across three continents.",
    image: null, // Replace with actual image ID from Appwrite Storage
  },
  {
    name: "Marcus Chen",
    role: "Head of Production",
    bio: "Former touring production manager turned experiential logistics wizard.",
    image: null,
  },
  {
    name: "Sophia Patel",
    role: "Event Designer",
    bio: "Award-winning designer specializing in immersive environments and spatial storytelling.",
    image: null,
  },
  {
    name: "Jordan Taylor",
    role: "Client Experience Lead",
    bio: "Your dedicated partner from concept to curtain call, ensuring every detail exceeds expectations.",
    image: null,
  },
];

export default function Team() {
  return (
    <section
      id="team"
      className="relative isolate px-6 py-24 sm:px-8 lg:px-12"
    >
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-pink-300/80">
            Meet the makers
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            The team behind the magic
          </h2>
          <p className="mt-4 text-base text-neutral-300 sm:text-lg">
            A collective of creatives, producers, and experience designers
            obsessed with the details that matter
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, idx) => (
            <article
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] transition duration-500 hover:border-white/30 hover:bg-white/[0.08]"
            >
              <div className="pointer-events-none absolute -inset-8 z-0 rounded-[36px] opacity-0 blur-3xl transition duration-500 group-hover:opacity-100 group-hover:[background:radial-gradient(circle_at_top,_rgba(236,72,153,0.25),_transparent_70%)]" />

              <div className="relative z-10">
                <div className="flex h-72 items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/20 bg-white/5 text-5xl font-bold text-white/40">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.35em] text-fuchsia-300/80">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-base text-neutral-300">
            Want to join our crew?{" "}
            <a
              href="mailto:careers@jamevents.com"
              className="font-semibold text-fuchsia-300 transition hover:text-fuchsia-200"
            >
              We&apos;re always looking for talented people
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
