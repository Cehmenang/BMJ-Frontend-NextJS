"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

// ── 5 placeholder landscape images (ganti dengan foto toko asli) ──
const GALLERY = [
  { src: "/DonnerBanner.webp",  caption: "Tampak Depan Toko" },
  { src: "/DonnerBanner.webp",  caption: "Area Display Gitar" },
  { src: "/DonnerBanner.webp",  caption: "Studio & Recording Corner" },
  { src: "/DonnerBanner.webp",  caption: "Area Drum & Perkusi" },
  { src: "/DonnerBanner.webp",  caption: "Koleksi Keyboard & Piano" },
];

const STATS = [
  { value: "15+", label: "Tahun Berpengalaman" },
  { value: "5.000+", label: "Produk Tersedia" },
  { value: "200+", label: "Brand Resmi" },
  { value: "50K+", label: "Pelanggan Puas" },
];

const SOCIALS = [
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    handle: "+62 819 2929 0560",
    href: "https://wa.me/6281929290560",
    color: "hover:text-green-400",
    bg: "hover:bg-green-400/10",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    handle: "@bandarmusikjakarta",
    href: "https://instagram.com/bandarmusikjakarta",
    color: "hover:text-pink-400",
    bg: "hover:bg-pink-400/10",
  },
  {
    icon: FaTiktok,
    label: "TikTok",
    handle: "@bandarmusikjkt",
    href: "https://tiktok.com/@bandarmusikjkt",
    color: "hover:text-white",
    bg: "hover:bg-white/10",
  },
  {
    icon: FaYoutube,
    label: "YouTube",
    handle: "Bandar Musik Jakarta",
    href: "https://youtube.com/@bandarmusikjakarta",
    color: "hover:text-red-400",
    bg: "hover:bg-red-400/10",
  },
];

export default function About() {
  const [activeImg, setActiveImg] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-advance gallery
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImg(i => (i + 1) % GALLERY.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg-site">

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative h-[70vh] md:h-[85vh] overflow-hidden bg-third flex items-end"
      >
        {/* Parallax images */}
        {GALLERY.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === activeImg ? "opacity-100" : "opacity-0"
            }`}
            style={{ transform: `translateY(${scrollY * 0.25}px)` }}
          >
            <img
              src={img.src}
              alt={img.caption}
              className="w-full h-full object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-third/95 via-third/40 to-third/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-third/60 to-transparent" />
          </div>
        ))}

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 pb-14 md:pb-20 w-full">
          <p className="font-poppins text-[10px] font-semibold tracking-[0.25em] uppercase text-second mb-4">
            Tentang Kami
          </p>
          <h1 className="font-play text-[clamp(36px,6vw,80px)] font-bold text-primary leading-[1.05] mb-6 max-w-3xl">
            Surga Alat Musik<br />
            <em className="text-second not-italic">Jakarta</em> sejak 2009
          </h1>
          <p className="font-poppins text-[14px] text-primary/55 max-w-lg leading-relaxed">
            Lebih dari satu dekade melayani musisi Indonesia dengan koleksi alat musik terlengkap dari brand terbaik dunia.
          </p>

          {/* Image dots */}
          <div className="flex items-center gap-2 mt-8">
            {GALLERY.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === activeImg
                    ? "w-8 h-1.5 bg-second"
                    : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
            <span className="font-poppins text-[11px] text-primary/30 ml-2">
              {GALLERY[activeImg].caption}
            </span>
          </div>
        </div>

        {/* Decorative big text */}
        <span className="absolute right-[-20px] bottom-[-20px] font-play text-[180px] font-black text-white/3 leading-none pointer-events-none select-none hidden md:block">
          BMJ
        </span>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-third border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
            {STATS.map((stat, i) => (
              <div key={i} className="py-8 px-6 text-center">
                <p className="font-play text-[clamp(28px,3vw,42px)] font-bold text-second leading-none mb-1">
                  {stat.value}
                </p>
                <p className="font-poppins text-[11px] text-primary/40 uppercase tracking-[0.1em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-12 md:gap-20 items-center">

          {/* Left */}
          <div>
            <p className="font-poppins text-[10px] font-semibold tracking-[0.2em] uppercase text-second mb-3">
              Cerita Kami
            </p>
            <h2 className="font-play text-[clamp(28px,4vw,48px)] font-bold text-third leading-tight mb-6">
              Dari passion menjadi<br />
              <em className="text-second not-italic">destinasi musik</em>
            </h2>
            <div className="space-y-4 font-poppins text-[13.5px] text-third/60 leading-relaxed">
              <p>
                Bandar Musik Jakarta lahir dari kecintaan mendalam terhadap musik. Dimulai sebagai toko kecil di sudut Jakarta Selatan pada 2009, kami tumbuh menjadi salah satu pusat alat musik terlengkap di Indonesia.
              </p>
              <p>
                Kami percaya bahwa setiap musisi — dari pemula hingga profesional — berhak mendapatkan instrumen berkualitas dengan harga yang jujur. Itulah mengapa kami bermitra langsung dengan lebih dari 200 brand resmi dari seluruh dunia.
              </p>
              <p>
                Lebih dari sekadar toko, kami adalah komunitas. Tempat di mana musisi bisa mencoba, berdiskusi, dan menemukan suara mereka.
              </p>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <div className="w-12 h-12 rounded-full bg-second flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-third" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div>
                <p className="font-poppins text-[13px] font-semibold text-third">"Musik adalah bahasa universal"</p>
                <p className="font-poppins text-[11px] text-third/40">— Pendiri Bandar Musik Jakarta</p>
              </div>
            </div>
          </div>

          {/* Right — staggered image grid */}
          <div className="grid grid-cols-2 gap-3 h-[480px]">
            <div className="flex flex-col gap-3">
              <div className="flex-1 rounded-2xl overflow-hidden">
                <img src={GALLERY[0].src} alt={GALLERY[0].caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="h-32 rounded-2xl overflow-hidden">
                <img src={GALLERY[1].src} alt={GALLERY[1].caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-8">
              <div className="h-32 rounded-2xl overflow-hidden">
                <img src={GALLERY[2].src} alt={GALLERY[2].caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden">
                <img src={GALLERY[3].src} alt={GALLERY[3].caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY STRIP ── */}
      <section className="py-6 overflow-hidden">
        <div className="flex gap-4 animate-[gallery-scroll_30s_linear_infinite]" style={{ width: "max-content" }}>
          {[...GALLERY, ...GALLERY].map((img, i) => (
            <div key={i} className="w-64 h-40 rounded-xl overflow-hidden flex-shrink-0">
              <img src={img.src} alt={img.caption} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <style jsx>{`
          @keyframes gallery-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── VISIT & CONTACT ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Map */}
          <div>
            <p className="font-poppins text-[10px] font-semibold tracking-[0.2em] uppercase text-second mb-3">
              Lokasi Kami
            </p>
            <h2 className="font-play text-[clamp(24px,3vw,38px)] font-bold text-third leading-tight mb-2">
              Temukan Kami
            </h2>
            <p className="font-poppins text-[13px] text-third/50 mb-6 leading-relaxed">
              Jl. Melawai Raya No. 12, Blok M, Jakarta Selatan 12160<br />
              Senin – Sabtu: 09.00 – 20.00 WIB · Minggu: 10.00 – 18.00 WIB
            </p>

            {/* Google Maps embed — ganti koordinat sesuai lokasi asli */}
            <div className="w-full h-72 md:h-80 rounded-2xl overflow-hidden border border-third/10 shadow-[0_4px_24px_rgba(62,63,32,0.08)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1234567890!2d106.7900000!3d-6.2400000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTQnMjQuMCJTIDEwNsKwNDcnMjQuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <Link
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 font-poppins text-[12.5px] text-third/50 hover:text-second transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              Buka di Google Maps
            </Link>
          </div>

          {/* Social + Contact */}
          <div>
            <p className="font-poppins text-[10px] font-semibold tracking-[0.2em] uppercase text-second mb-3">
              Hubungi Kami
            </p>
            <h2 className="font-play text-[clamp(24px,3vw,38px)] font-bold text-third leading-tight mb-6">
              Tetap Terhubung
            </h2>

            <div className="space-y-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-4 rounded-xl border border-third/8 bg-white ${social.bg} transition-all duration-200 group`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-third/5 flex items-center justify-center flex-shrink-0 transition-colors ${social.color}`}>
                    <social.icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.08em] text-third/40">
                      {social.label}
                    </p>
                    <p className="font-poppins text-[13.5px] font-medium text-third truncate">
                      {social.handle}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-third/25 group-hover:text-third/60 flex-shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="mx-6 md:mx-20 mb-20 rounded-3xl overflow-hidden relative">
        <img
          src={GALLERY[4].src}
          alt="Store"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-third/92 via-third/75 to-third/40" />
        <div className="relative z-10 px-10 md:px-16 py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-poppins text-[10px] font-semibold tracking-[0.2em] uppercase text-second mb-3">
              Kunjungi Kami
            </p>
            <h2 className="font-play text-[clamp(24px,3.5vw,44px)] font-bold text-primary leading-tight max-w-md">
              Rasakan langsung pengalaman berbelanja di toko kami
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="https://wa.me/6281929290560"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-second text-third font-poppins text-[13px] font-semibold hover:bg-[#fbbe74] transition-colors shadow-[0_4px_20px_rgba(249,173,82,0.4)]"
            >
              <FaWhatsapp size={16} />
              Chat WhatsApp
            </Link>
            <Link
              href="/produk"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 text-primary font-poppins text-[13px] font-medium hover:bg-white/10 transition-colors"
            >
              Lihat Produk
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}