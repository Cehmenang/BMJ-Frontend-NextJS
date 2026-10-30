"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

const MarqueeItem = () => (
  <span className="inline-flex shrink-0 items-center gap-3 px-6 py-3 text-[12px] font-black uppercase tracking-[0.2em] text-third md:text-[13px]">
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 text-third"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="3" fill="currentColor" />
    </svg>
    BMJ 100% ORIGINAL
  </span>
);

function MarqueeStrip() {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-second text-third">
      <div className="bmj-marquee flex w-max">
        {Array(10)
          .fill(null)
          .map((_, i) => (
            <MarqueeItem key={`a-${i}`} />
          ))}
        {Array(10)
          .fill(null)
          .map((_, i) => (
            <MarqueeItem key={`b-${i}`} />
          ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .bmj-marquee {
          animation: marquee-scroll 22s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .bmj-marquee { animation: none; }
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

const paymentBadges = ["VISA", "BCA", "GoPay", "OVO"];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 border-b border-dashed border-primary/15 py-2.5 text-[13px] text-primary/60 transition-colors duration-200 hover:text-primary"
    >
      <span className="truncate">{children}</span>
      <svg
        className="h-3.5 w-3.5 flex-shrink-0 -translate-x-1 text-primary/30 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-second group-hover:opacity-100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </Link>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 border-b border-dashed border-primary/25 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">
      {children}
    </h3>
  );
}

export default function MainFooter({ promos }: { promos: { namaPromo: string }[] }) {
  return (
    <footer className="mt-16 bg-third text-primary md:mt-24">
      <MarqueeStrip />

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 md:px-14">
        <div className="flex flex-col gap-6 border-b border-dashed border-primary/25 py-10 md:flex-row md:items-end md:justify-between md:gap-10 md:py-14">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">
              Bandar Musik Jakarta
            </p>
            <h2 className="font-boldonse text-[clamp(20px,3.2vw,40px)] font-bold uppercase leading-[1.25] text-primary">
              Cari Alat Musik <em className="not-italic text-second">Impianmu?</em>
            </h2>
            <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-primary/60 md:text-[14px]">
              Tanya ketersediaan dan harga terbaik langsung ke tim kami.
            </p>
          </div>
          <a
            href="https://wa.me/6281929290560"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-sm bg-second px-6 py-3.5 text-[12px] font-bold uppercase tracking-wider text-third transition-all duration-200 hover:bg-primary active:scale-[0.98] md:w-auto"
          >
            <FaWhatsapp size={20} />
            Tanya via WhatsApp
          </a>
        </div>

        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 md:py-14 lg:grid-cols-5 lg:gap-12">
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-2">
            <div>
              <span className="font-boldonse text-[18px] font-bold uppercase leading-tight text-primary md:text-[22px]">
                Bandar Musik Jakarta
              </span>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-second">
                100% Original • Brand
              </p>
            </div>

            <p className="max-w-md text-[13px] leading-relaxed text-primary/60">
              Produk asli, kualitas terjamin. Kami berkomitmen untuk memberikan yang terbaik.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {socialLinks.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-sm text-primary/70 ring-1 ring-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-second hover:text-third hover:ring-second"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <ColumnTitle>Company</ColumnTitle>
            <ul className="flex flex-col">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnTitle>Promo Tersedia</ColumnTitle>
            <ul className="flex flex-col">
              {promos.map((promo, index: number) => (
                <li key={index}>
                  <FooterLink href={`/promo?page=1&promo=${encodeURIComponent(promo.namaPromo)}`}>
                    {promo.namaPromo}
                  </FooterLink>
                </li>
              ))}
              {promos.length === 0 && (
                <li className="py-2.5 text-[12px] italic text-primary/35">Belum ada promo</li>
              )}
            </ul>
          </div>

          <div>
            <ColumnTitle>Legal</ColumnTitle>
            <ul className="flex flex-col">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-dashed border-primary/25 py-5 sm:flex-row">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary/40">
            © {new Date().getFullYear()} BMJ. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            {paymentBadges.map((pay) => (
              <span
                key={pay}
                className="rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary/60 ring-1 ring-primary/15"
              >
                {pay}
              </span>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Kembali ke atas"
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-sm bg-primary/10 text-primary/70 transition-colors duration-200 hover:bg-second hover:text-third"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}