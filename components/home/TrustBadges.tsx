"use client";

import { useEffect, useRef } from "react";
import { BadgeCheck, ThumbsUp, ShieldCheck, Wallet } from "lucide-react";

const BADGES = [
  {
    icon: <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "100% Original",
    sub: "Semua produk bergaransi resmi",
  },
  {
    icon: <BadgeCheck className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Terpercaya",
    sub: "Melayani sejak 1998",
  },
  {
    icon: <ThumbsUp className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Terlengkap",
    sub: "Ribuan pilihan alat musik",
  },
  {
    icon: <Wallet className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Harga Bersahabat",
    sub: "Garansi harga terbaik",
  },
];

export default function TrustBadges() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ctx: any;

    import("gsap").then(async (mod) => {
      const gsap       = mod.gsap ?? mod.default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Cards slide up on scroll
        gsap.fromTo(
          cardRefs.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );

        // Icons bounce once after cards appear
        gsap.fromTo(
          iconRefs.current,
          { scale: 0.6, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: "back.out(1.7)",
            stagger: 0.1,
            delay: 0.25,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }, sectionRef);
    });

    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-8 md:px-14 relative z-20"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {BADGES.map((badge, i) => (
          <div
            key={badge.title}
            ref={(el) => { cardRefs.current[i] = el; }}
            style={{ opacity: 0 }}
            className="
              flex items-center gap-3 sm:gap-4
              border border-slate-300 rounded-2xl
              px-4 sm:px-6 py-4 sm:py-5
              shadow-[0_4px_24px_rgba(62,63,32,0.08)]
              group hover:shadow-[0_8px_32px_rgba(62,63,32,0.13)]
              hover:-translate-y-0.5 transition-all duration-200
            "
          >
            <div
              ref={(el) => { iconRefs.current[i] = el; }}
              style={{ opacity: 0 }}
              className="
                flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl
                bg-forest/6 text-forest
                flex items-center justify-center
                group-hover:bg-second/15 group-hover:text-second
                transition-colors duration-200
              "
            >
              {badge.icon}
            </div>
            <div>
              <p className="font-semibold text-[13px] sm:text-[14px] text-third leading-tight">
                {badge.title}
              </p>
              <p className="text-[11px] sm:text-[12px] text-third/55 mt-0.5 leading-snug">
                {badge.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}