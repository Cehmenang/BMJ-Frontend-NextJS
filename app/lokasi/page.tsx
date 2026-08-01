import type { Metadata } from "next";
import Image from "next/image";
import {
  MapPin,
  Navigation,
  MessageCircle,
  Instagram,
  Music2,
  Clock,
} from "lucide-react";

// =====================================================================
// GANTI DATA DI SINI SAJA — semua konten halaman diatur dari sini
// =====================================================================
const STORE = {
  name: "Bandar Musik Jakarta",
  address: "Jl. Rajawali Selatan I No.26A, RT.3/RW.2, Kecamatan Sawah Besar, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10720",
  note: "No. 26A, Pagar Hitam. Seberang Toko Rajawali Pancing.",
  // Ganti dengan link "Share" dari tombol Share di Google Maps
  gmapsLink: "https://maps.app.goo.gl/bbpcbr9VtMfuSM4FA",
  // Ganti dengan embed src dari Google Maps: Share > Sematkan peta > copy src iframe
  gmapsEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.880746792241!2d106.837824!3d-6.1467152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f52291955f13%3A0xa50788e55fe5c9e9!2sBandar%20Musik%20Jakarta%20BMJ!5e0!3m2!1sen!2sid!4v1785543043776!5m2!1sen!2sid",
  photo:
    "lokasi.webp", // foto ngasal — ganti dengan foto toko asli
  whatsapp: "6281929290560", // format 62xxxx tanpa tanda +
  instagram: "bandarmusikjakarta_bmj",
  tiktok: "bandarmusikjakarta_bmj",
  hours: [
    { day: "Senin", time: "10.00 – 19.30" },
    { day: "Selasa", time: "10.00 – 19.30" },
    { day: "Rabu", time: "10.00 – 19.30" },
    { day: "Kamis", time: "10.00 – 19.30" },
    { day: "Jumat", time: "10.00 – 19.30" },
    { day: "Sabtu", time: "10.00 – 18.00" },
  ],
};
// =====================================================================

const SITE_URL = "https://bandarmusikjakarta.com/lokasi";

export const metadata: Metadata = {
  title: `${STORE.name} — Lokasi Toko`,
  description: `${STORE.address}. ${STORE.note}`,
  openGraph: {
    title: `${STORE.name} — Lokasi Toko`,
    description: STORE.address,
    images: [{ url: STORE.photo }],
    url: SITE_URL,
    type: "website",
  },
};

export default function LokasiPage() {
  const waLink = `https://wa.me/${STORE.whatsapp}`;
  const igLink = `https://instagram.com/${STORE.instagram}`;
  const ttLink = `https://tiktok.com/@${STORE.tiktok}`;

  return (
    <main className="min-h-screen bg-gray-50 font-inter">
      <div className="max-w-xl mx-auto px-4 py-10 pt-20">
        {/* Header */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-amber-600">
            Lokasi Toko
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-third text-center mb-2">
          {STORE.name}
        </h1>
        <p className="text-[13px] text-third/50 text-center max-w-sm mx-auto mb-8 leading-relaxed">
          {STORE.address}
        </p>

        {/* Photo + Map + CTA card */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden mb-6">
          <div className="relative w-full aspect-[16/9] bg-gray-100">
            <Image
              src={'/lokasi.webp'}
              alt={`Tampak depan ${STORE.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
            />
          </div>

          <iframe
            src={STORE.gmapsEmbedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Peta lokasi toko"
            className="w-full aspect-[16/9] border-t border-slate-200"
          />

          <div className="p-4 md:p-5">
            <p className="text-[13px] text-third/50 mb-3 leading-relaxed">
              {STORE.note}
            </p>
            <a
              href={STORE.gmapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 w-full bg-third text-white font-bold text-[14px] px-4 py-3 rounded-xl hover:bg-third/90 transition-colors duration-150"
            >
              <Navigation className="w-4 h-4 text-second group-hover:translate-x-0.5 transition-transform" />
              Buka di Google Maps
            </a>
          </div>
        </div>

        {/* Contact */}
        <p className="text-[11px] font-bold tracking-widest uppercase text-amber-600 mb-3 px-1">
          Hubungi Kami
        </p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white py-4 hover:border-amber-600 hover:bg-amber-50/40 transition-colors duration-150"
          >
            <MessageCircle className="w-5 h-5 text-third" />
            <span className="text-[11px] font-semibold text-third/60">WhatsApp</span>
          </a>
          <a
            href={igLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white py-4 hover:border-amber-600 hover:bg-amber-50/40 transition-colors duration-150"
          >
            <Instagram className="w-5 h-5 text-third" />
            <span className="text-[11px] font-semibold text-third/60">Instagram</span>
          </a>
          <a
            href={ttLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white py-4 hover:border-amber-600 hover:bg-amber-50/40 transition-colors duration-150"
          >
            <Music2 className="w-5 h-5 text-third" />
            <span className="text-[11px] font-semibold text-third/60">TikTok</span>
          </a>
        </div>

        {/* Hours */}
        <p className="text-[11px] font-bold tracking-widest uppercase text-amber-600 mb-3 px-1">
          Jam Operasional
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 md:px-5 py-1">
          {STORE.hours.map((h, i) => (
            <div
              key={h.day}
              className={`flex items-center justify-between py-3 ${
                i !== STORE.hours.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <span className="text-[13px] font-semibold text-third">{h.day}</span>
              <span className="text-[13px] font-bold text-amber-700 tabular-nums">
                {h.time}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <Clock className="w-3.5 h-3.5 text-third/40" />
          <span className="text-[12px] text-third/40">Tutup hari Minggu</span>
        </div>
      </div>
    </main>
  );
}