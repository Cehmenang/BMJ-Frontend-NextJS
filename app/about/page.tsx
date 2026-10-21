"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Archivo } from "next/font/google";
import { FaWhatsapp, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const archivo = Archivo({ subsets: ["latin"], weight: ["800", "900"], display: "swap" });

const GALLERY = [
  { src: "/about1.webp", caption: "Tampak Depan Toko" },
  { src: "/about2.webp", caption: "Area Display Gitar" },
  { src: "/about3.webp", caption: "Studio & Recording Corner" },
  { src: "/about4.webp", caption: "Area Drum & Perkusi" },
  { src: "/about4.webp", caption: "Koleksi Keyboard & Piano" },
];

const STATS = [
  { value: "15+", to: 15, suffix: "+", label: "Tahun Berpengalaman" },
  { value: "5.000+", to: 5000, suffix: "+", label: "Produk Tersedia" },
  { value: "200+", to: 200, suffix: "+", label: "Brand Resmi" },
  { value: "50K+", to: 50, suffix: "K+", label: "Pelanggan Puas" },
];

const SOCIALS = [
  { icon: FaWhatsapp, label: "WhatsApp", handle: "+62 819 2929 0560", href: "https://wa.me/6281929290560" },
  { icon: FaInstagram, label: "Instagram", handle: "@bandarmusikjakarta_bmj", href: "https://instagram.com/bandarmusikjakarta_bmj" },
  { icon: FaTiktok, label: "TikTok", handle: "@bandarmusikjakarta_bmj", href: "https://tiktok.com/@bandarmusikjakarta_bmj" },
  { icon: FaYoutube, label: "YouTube", handle: "Bandar Musik Jakarta", href: "https://youtube.com/@bandarmusikjakarta" },
];

const WRAP = "max-w-7xl mx-auto px-6 md:px-20";
const SECTION = "py-28"; // 112px atas-bawah di semua section
const HEADING = `${archivo.className} font-black uppercase leading-none tracking-tight`;
const H2 = `${HEADING} text-[clamp(32px,4.4vw,56px)] text-third mb-6`;
const EYEBROW =
  "font-poppins text-xs font-semibold text-third/70 mb-4 flex items-center gap-3 before:block before:h-0.5 before:w-8 before:bg-second";
const BODY = "font-poppins text-[15px] leading-[1.7] text-third/80";
const BTN =
  "inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded border-2 font-poppins text-[13px] font-semibold uppercase tracking-wide transition-colors";
const BTN_FILL = `${BTN} bg-second border-second text-third hover:bg-[#fbbe74] hover:border-[#fbbe74]`;
const BTN_LINE = `${BTN} border-primary text-primary hover:bg-primary hover:text-third`;

export default function About() {
  const [activeImg, setActiveImg] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  // ── Animasi GSAP (otomatis nonaktif kalau user pilih "reduce motion") ──
  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1) Hero: satu urutan masuk saat halaman dibuka
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-hero='media']", { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power3.inOut" })
          .from("[data-hero='item']", { y: 24, opacity: 0, duration: 0.7, stagger: 0.12 }, 0.2)
          .from("[data-hero='mark']", { clipPath: "inset(0 100% 0 0)", duration: 0.6, ease: "power2.inOut" }, "-=0.5");

        // 2) Angka statistik menghitung naik saat masuk layar
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const to = Number(el.dataset.count);
          const suffix = el.dataset.suffix ?? "";
          const o = { n: 0 };
          el.textContent = `0${suffix}`;
          gsap.to(o, {
            n: to,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = `${Math.round(o.n).toLocaleString("id-ID")}${suffix}`;
            },
          });
        });

        // 3) Blok yang muncul saat di-scroll (sekali saja)
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 32,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
          gsap.from(group.children, {
            y: 32,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          });
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // Auto-advance foto hero
  useEffect(() => {
    const timer = setInterval(() => setActiveImg((i) => (i + 1) % GALLERY.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={root} className="min-h-screen bg-bg-site font-poppins">
      {/* ── HERO ── */}
      <section className="bg-third text-primary">
        <div className={`${WRAP} py-24`}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-end">
            <div>
              <p data-hero="item" className={`${EYEBROW} !text-primary/70`}>Tentang Kami</p>
              <h1 data-hero="item" className={`${HEADING} text-[clamp(30px,4.2vw,60px)] leading-[1.05] mb-8`}>
                Surga alat musik{" "}
                <span data-hero="mark" className="inline-block bg-second text-third px-3">Jakarta</span> sejak 2009
              </h1>
              <p data-hero="item" className={`${BODY} !text-primary/80 max-w-md mb-8`}>
                Lebih dari satu dekade melayani musisi Indonesia dengan koleksi alat musik terlengkap
                dari brand terbaik dunia.
              </p>
              <div data-hero="item" className="flex flex-wrap gap-4">
                <Link href="https://wa.me/6281929290560" target="_blank" rel="noopener noreferrer" className={BTN_FILL}>
                  <FaWhatsapp size={16} /> Chat WhatsApp
                </Link>
                <Link href="/produk" className={BTN_LINE}>
                  Lihat Produk
                </Link>
              </div>
            </div>

            {/* Foto bergantian */}
            <div>
              <div data-hero="media" className="relative h-[320px] md:h-[480px] border-2 border-primary overflow-hidden">
                {GALLERY.map((img, i) => (
                  <img
                    key={i}
                    src={img.src}
                    alt={img.caption}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                      i === activeImg ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4">
                {GALLERY.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Tampilkan foto: ${img.caption}`}
                    className={`h-2 rounded-full transition-all ${
                      i === activeImg ? "w-8 bg-second" : "w-2 bg-primary/40 hover:bg-primary/70"
                    }`}
                  />
                ))}
                <span className="text-xs text-primary/70 ml-2">{GALLERY[activeImg].caption}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-third text-primary border-t-2 border-primary/25">
        <div className={WRAP}>
          <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x-2 md:divide-primary/25">
            {STATS.map((stat) => (
              <div key={stat.label} className="py-8 px-6 first:pl-0">
                <p className={`${HEADING} text-[clamp(36px,4vw,56px)] text-second mb-2`} data-count={stat.to} data-suffix={stat.suffix}>{stat.value}</p>
                <p className="text-xs font-medium uppercase tracking-widest text-primary/75">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className={`${WRAP} ${SECTION}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div data-reveal className="border-t-4 border-third pt-6">
            <p className={EYEBROW}>Cerita Kami</p>
            <h2 className={H2}>Dari passion jadi destinasi musik</h2>
            <div className="space-y-4">
              <p className={BODY}>
                Bandar Musik Jakarta lahir dari kecintaan mendalam terhadap musik. Dimulai sebagai toko kecil
                di sudut Jakarta Selatan pada 2009, kami tumbuh menjadi salah satu pusat alat musik terlengkap
                di Indonesia.
              </p>
              <p className={BODY}>
                Kami percaya setiap musisi, dari pemula hingga profesional, berhak mendapatkan instrumen
                berkualitas dengan harga yang jujur. Itulah mengapa kami bermitra langsung dengan lebih dari
                200 brand resmi dari seluruh dunia.
              </p>
              <p className={BODY}>
                Lebih dari sekadar toko, kami adalah komunitas. Tempat musisi bisa mencoba, berdiskusi, dan
                menemukan suara mereka.
              </p>
            </div>

            <blockquote className="mt-8 border-2 border-third border-l-[12px] border-l-second bg-white p-6">
              <p className={`${archivo.className} text-xl font-extrabold leading-snug text-third mb-2`}>
                “Musik adalah bahasa universal”
              </p>
              <footer className="text-xs font-medium uppercase tracking-wider text-third/70">
                Pendiri Bandar Musik Jakarta
              </footer>
            </blockquote>
          </div>

          {/* Grid foto: tinggi & gap konsisten (gap-4 = 16px) */}
          <div data-stagger className="grid grid-cols-2 gap-4">
            <img src={GALLERY[1].src} alt={GALLERY[1].caption} className="w-full h-80 object-cover border-2 border-third" />
            <img src={GALLERY[2].src} alt={GALLERY[2].caption} className="w-full h-52 object-cover border-2 border-third" />
            <img src={GALLERY[3].src} alt={GALLERY[3].caption} className="w-full h-52 object-cover border-2 border-third" />
            <img src={GALLERY[4].src} alt={GALLERY[4].caption} className="w-full h-80 object-cover border-2 border-third" />
          </div>
        </div>
      </section>

      {/* ── LOKASI & KONTAK ── */}
      <section className="bg-[#EAE3D2] border-y-2 border-third">
        <div className={`${WRAP} ${SECTION}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Peta */}
            <div>
              <p className={EYEBROW}>Lokasi Kami</p>
              <h2 className={H2}>Temukan kami</h2>
              <p className={`${BODY} mb-2`}>
                Jl. Rajawali Selatan I No.26A, RT.3/RW.2, Kecamatan Sawah Besar, Kota Jakarta Pusat, DKI
                Jakarta 10720
              </p>
              <p className={`${BODY} !text-third font-semibold mb-6`}>Senin – Sabtu: 10.00 – 20.00 WIB</p>

              <div className="w-full h-80 border-2 border-third overflow-hidden mb-6">
                <iframe
                  title="Lokasi Bandar Musik Jakarta"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15867.603949652941!2d106.83023359999999!3d-6.143999999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f52291955f13%3A0xa50788e55fe5c9e9!2sBandar%20Musik%20Jakarta%20BMJ!5e0!3m2!1sid!2sid!4v1777033545807!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${BTN} bg-third border-third text-primary hover:bg-third/85`}
              >
                Buka di Google Maps
              </a>
            </div>

            {/* Sosmed */}
            <div>
              <p className={EYEBROW}>Hubungi Kami</p>
              <h2 className={H2}>Tetap terhubung</h2>
              <div data-stagger className="flex flex-col gap-4 mt-8">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded border-2 border-third bg-white text-third hover:bg-third hover:text-primary transition-colors"
                  >
                    <span className="flex-none w-12 h-12 rounded bg-second text-third flex items-center justify-center">
                      <s.icon size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-widest opacity-70">
                        {s.label}
                      </span>
                      <span className="block text-[15px] font-semibold truncate">{s.handle}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`${WRAP} ${SECTION}`}>
        <div data-reveal className="bg-third text-primary rounded border-2 border-third p-8 md:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
          <div className="max-w-xl">
            <p className={`${EYEBROW} !text-primary/70`}>Kunjungi Kami</p>
            <h2 className={`${H2} !text-primary !mb-0`}>Rasakan langsung belanja di toko kami</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="https://wa.me/6281929290560" target="_blank" rel="noopener noreferrer" className={BTN_FILL}>
              <FaWhatsapp size={16} /> Chat WhatsApp
            </Link>
            <Link href="/produk" className={BTN_LINE}>
              Lihat Produk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}