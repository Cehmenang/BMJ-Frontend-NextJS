"use client";

import Link from "next/link";

// ─── Marquee Strip ────────────────────────────────────────────────────────────
const MarqueeItem = () => (
  <span
    className="inline-flex items-center gap-3 px-6 py-3 text-sm font-bold uppercase tracking-widest shrink-0 text-third"
  >
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
    <div
      className="overflow-hidden whitespace-nowrap bg-primary border-2 border-third text-third"
    >
      {/* Wrapper dengan width cukup besar, animasi geser -50% = seamless loop */}
      <div
        className="flex w-max"
        style={{
          animation: "marquee-scroll 18s linear infinite",
        }}
      >
        {/* Render 2 set identik — saat set pertama habis, set kedua langsung menyambung */}
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

// ─── Footer ───────────────────────────────────────────────────────────────────
const companyLinks = [{ label: "Contact Us", href: "/contact" }];

const shopLinks = [
  { label: "All Products", href: "/products" },
  { label: "Pakaian", href: "/pakaian" },
  { label: "Aksesoris", href: "/aksesoris" },
  { label: "Koleksi Baru", href: "/new" },
  { label: "Sale", href: "/sale" },
];

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
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
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

export default function Footer() {
  return (
    <footer className="bg-third mt-24">
      {/* Marquee */}
      <MarqueeStrip />

      {/* Divider */}
      <div
        className="h-px w-full"
      />

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <div>
              <span
                className="text-2xl font-extrabold tracking-tight text-primary"
              >
                Bandar Musik Jakarta
              </span>
              <p
                className="mt-1 text-xs font-semibold uppercase tracking-widest text-primary"
                style={{ opacity: 0.5 }}
              >
                100% Original • Brand
              </p>
            </div>

            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-primary)", opacity: 0.6 }}
            >
              Produk asli, kualitas terjamin. Kami berkomitmen untuk memberikan
              yang terbaik.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 hover:scale-110"
                  style={{
                    borderColor: "var(--color-third)",
                    color: "var(--color-primary)",
                    opacity: 0.7,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--color-primary)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-primary)";
                    (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "var(--color-third)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-primary)";
                    (e.currentTarget as HTMLAnchorElement).style.opacity =
                      "0.7";
                  }}
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3
              className="mb-5 text-xs font-bold uppercase tracking-widest text-primary"
            >
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

          {/* Shop Links */}
          <div>
            <h3
              className="mb-5 text-xs font-bold uppercase tracking-widest text-primary"
            >
              Shop
            </h3>
            <ul className="flex flex-col gap-3">
              {shopLinks.map((link) => (
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

          {/* Legal Links */}
          <div>
            <h3
              className="mb-5 text-xs font-bold uppercase tracking-widest text-primary"
            >
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
      <div
        className="h-px w-full"
        style={{ backgroundColor: "var(--color-third)" }}
      />
      <div className="mx-auto max-w-7xl px-6 py-5 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p
            className="text-xs"
            style={{ color: "var(--color-primary)", opacity: 0.4 }}
          >
            © {new Date().getFullYear()} BMJ. All rights reserved.
          </p>

          {/* Payment Icons */}
          <div className="flex items-center gap-2">
            {["VISA", "BCA", "GoPay", "OVO"].map((pay) => (
              <span
                key={pay}
                className="rounded px-2 py-1 text-xs font-bold"
                style={{
                  backgroundColor: "var(--color-third)",
                  color: "var(--color-primary)",
                  opacity: 0.7,
                }}
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