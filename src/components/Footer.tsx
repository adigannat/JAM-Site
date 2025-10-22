import Link from "next/link";

const footerLinks = {
  services: [
    { label: "Corporate Events", href: "#services" },
    { label: "Social Celebrations", href: "#services" },
    { label: "Brand Activations", href: "#services" },
    { label: "Festival Production", href: "#services" },
  ],
  company: [
    { label: "About Us", href: "#team" },
    { label: "Our Work", href: "#past-events" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Partners", href: "#partners" },
  ],
  resources: [
    { label: "Contact", href: "#contact" },
    { label: "Newsletter", href: "#newsletter" },
    { label: "Careers", href: "mailto:careers@jamevents.com" },
    { label: "Press Kit", href: "mailto:press@jamevents.com" },
  ],
};

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-neutral-950/90 px-6 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-3 rounded-full border border-pink-400/30 bg-gradient-to-r from-pink-500/20 to-fuchsia-500/20 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-pink-400" />
              <span className="text-sm font-semibold uppercase tracking-[0.35em] text-pink-200">
                JAM Events
              </span>
            </div>
            <p className="mt-6 text-base text-neutral-300 leading-relaxed">
              Crafting unforgettable gatherings for brands, creatives, and
              communities worldwide. Where strategy, creativity, and precision
              meet.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-neutral-400 transition hover:border-pink-400/50 hover:bg-pink-500/10 hover:text-pink-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-white">
              Services
            </h3>
            <ul className="mt-6 space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-white">
              Company
            </h3>
            <ul className="mt-6 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-white">
              Resources
            </h3>
            <ul className="mt-6 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-neutral-500">
              © {year} JAM Events. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-neutral-500">
              <Link href="#" className="transition hover:text-neutral-300">
                Privacy Policy
              </Link>
              <Link href="#" className="transition hover:text-neutral-300">
                Terms of Service
              </Link>
              <Link
                href="mailto:hello@jamevents.com"
                className="transition hover:text-neutral-300"
              >
                hello@jamevents.com
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
