"use client";
import { useEffect, useRef } from "react";
import { BadgeCheck, ThumbsUp, ShieldCheck, Wallet } from "lucide-react";

const BADGES = [
  {
    icon: <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9" />,
    title: "100% Original",
    sub: "Semua produk bergaransi resmi",
  },
  {
    icon: <BadgeCheck className="w-8 h-8 sm:w-9 sm:h-9" />,
    title: "Terpercaya",
    sub: "Melayani sejak 1998",
  },
  {
    icon: <ThumbsUp className="w-8 h-8 sm:w-9 sm:h-9" />,
    title: "Terlengkap",
    sub: "Ribuan pilihan alat musik",
  },
  {
    icon: <Wallet className="w-8 h-8 sm:w-9 sm:h-9" />,
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
      const gsap = mod.gsap ?? mod.default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          cardRefs.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.1,
            scrollTrigger: { trigger: sectionRef.current, start: "top 88%", once: true },
          }
        );
        gsap.fromTo(
          iconRefs.current,
          { scale: 0.6, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)", stagger: 0.1, delay: 0.25,
            scrollTrigger: { trigger: sectionRef.current, start: "top 88%", once: true },
          }
        );
      }, sectionRef);
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-4 sm:mx-8 md:mx-28 relative z-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {BADGES.map((badge, i) => (
          <div
            key={badge.title}
            ref={(el) => { cardRefs.current[i] = el; }}
            style={{ opacity: 0 }}
            className="flex items-center gap-4 border border-slate-300 rounded-2xl px-5 py-4 shadow-[0_4px_24px_rgba(62,63,32,0.08)] group hover:shadow-[0_8px_32px_rgba(62,63,32,0.13)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <div
              ref={(el) => { iconRefs.current[i] = el; }}
              style={{ opacity: 0 }}
              className="flex-shrink-0 w-14 h-14 rounded-xl bg-third/6 text-third flex items-center justify-center group-hover:bg-second/15 group-hover:text-second transition-colors duration-200"
            >
              {badge.icon}
            </div>
            <div>
              <p className="font-semibold text-[15px] sm:text-[16px] text-third leading-tight">
                {badge.title}
              </p>
              <p className="text-[12px] sm:text-[13px] text-third/55 mt-0.5 leading-snug">
                {badge.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}