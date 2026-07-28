"use client";

import Link from "next/link";

const MarqueeItem = () => (
  <span className="inline-flex items-center gap-3 px-6 py-3 text-sm font-bold uppercase tracking-widest shrink-0 text-third">
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
      className="text-third"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="3" fill="currentColor" />
    </svg>
    BMJ 100% ORIGINAL
  </span>
);

function MarqueeStrip() {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-primary border-2 border-third text-third">
      <div
        className="flex w-max"
        style={{ animation: "marquee-scroll 18s linear infinite" }}
      >
        {Array(10).fill(null).map((_, i) => <MarqueeItem key={`a-${i}`} />)}
        {Array(10).fill(null).map((_, i) => <MarqueeItem key={`b-${i}`} />)}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

const companyLinks = [{ label: "About Us", href: "/about" }];

const legalLinks = [
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Store Policies", href: "/store-policies" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Sitemap", href: "/sitemap" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/bandarmusikjakarta_bmj",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Youtube",
    href: "https://youtube.com/@bandarmusikjakarta_bmj",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/bandarmusikjakarta_bmj",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.54V6.78a4.85 4.85 0 0 1-1.03-.09z" />
      </svg>
    ),
  },
];

export default function MainFooter({ promos }: { promos: { namaPromo: string }[] }) {
  return (
    <footer className="bg-third mt-24">
      {/* Marquee */}
      <MarqueeStrip />

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">

          {/* Brand Column — full width on mobile, spans 2 cols on sm */}
          <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-primary">
                Bandar Musik Jakarta
              </span>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-primary opacity-50">
                100% Original • Brand
              </p>
            </div>

            <p className="text-sm leading-relaxed text-primary opacity-60">
              Produk asli, kualitas terjamin. Kami berkomitmen untuk memberikan
              yang terbaik.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 flex-wrap">
              {socialLinks.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 text-primary opacity-70 transition-all duration-200 hover:opacity-100 hover:border-primary hover:scale-110"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-primary">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary/50 hover:text-primary transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Promo Links */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-primary">
              Promo Tersedia
            </h3>
            <ul className="flex flex-col gap-3">
              {promos.map((promo, index: number) => (
                <li key={index}>
                  <Link
                    href={`/promo?page=1&promo=${promo.namaPromo}`}
                    className="text-sm text-primary/50 hover:text-primary transition"
                  >
                    {promo.namaPromo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-primary">
              Legal
            </h3>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary/50 hover:text-primary transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="h-px w-full bg-primary/10" />
      <div className="mx-auto max-w-7xl px-6 py-5 md:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-primary opacity-40">
            © {new Date().getFullYear()} BMJ. All rights reserved.
          </p>

          {/* Payment Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            {["VISA", "BCA", "GoPay", "OVO"].map((pay) => (
              <span
                key={pay}
                className="rounded px-2 py-1 text-xs font-bold bg-primary/10 text-primary opacity-70"
              >
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}