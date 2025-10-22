"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-neutral-950/90 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 transition hover:scale-105"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-500 shadow-lg shadow-pink-500/30 transition group-hover:shadow-pink-500/50">
              <span className="font-bold text-white text-xl">J</span>
            </div>
            <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-purple-300 bg-clip-text font-semibold text-xl text-transparent">
              JAM Events
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative px-3 py-2 text-sm font-medium transition ${
                  pathname === link.href
                    ? "text-white"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 transition-all ${
                    pathname === link.href
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:scale-105 hover:shadow-pink-500/50"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/5 transition hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`h-0.5 w-5 bg-white transition ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-5 bg-white transition ${isMobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-5 bg-white transition ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="border-t border-white/10 bg-neutral-950/95 px-6 py-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                  pathname === link.href
                    ? "bg-gradient-to-r from-pink-500/20 via-fuchsia-500/20 to-purple-500/20 text-white"
                    : "text-neutral-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-pink-500/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
