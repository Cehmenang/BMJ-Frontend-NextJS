import { BadgeCheck, ThumbsUp, ShieldCheck, Wallet } from "lucide-react";

const BADGES = [
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "100% Original",
    sub: "Semua produk bergaransi resmi",
  },
  {
    icon: <BadgeCheck className="w-7 h-7" />,
    title: "Terpercaya",
    sub: "Melayani sejak 1998",
  },
  {
    icon: <ThumbsUp className="w-7 h-7" />,
    title: "Terlengkap",
    sub: "Ribuan pilihan alat musik",
  },
  {
    icon: <Wallet className="w-7 h-7" />,
    title: "Harga Bersahabat",
    sub: "Garansi harga terbaik",
  },
];

export default function TrustBadges() {
  return (
    <section className="px-14 relative z-20">
      <div className="grid grid-cols-4 gap-4">
        {BADGES.map((badge) => (
          <div
            key={badge.title}
            className="flex items-center gap-4 border border-slate-300 rounded-2xl px-6 py-5 shadow-[0_4px_24px_rgba(62,63,32,0.08)] group hover:shadow-[0_8px_32px_rgba(62,63,32,0.13)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-forest/6 text-forest flex items-center justify-center group-hover:bg-second/15 group-hover:text-second transition-colors duration-200">
              {badge.icon}
            </div>
            <div>
              <p className="font-semibold text-[14px] text-third leading-tight">{badge.title}</p>
              <p className="text-[12px] text-third/55 mt-0.5 leading-snug">{badge.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}