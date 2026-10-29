"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import gsap from "gsap";

const faqs = [
  {
    question: "Apakah semua produk di sini original?",
    answer: "Ya, semua produk di Bandar Musik Jakarta 100% original dan bergaransi resmi 1 tahun.",
  },
  {
    question: "Bagaimana cara melakukan pembelian?",
    answer: "Pembelian bisa dilakukan langsung di toko, via Whatsapp di 081929290560, atau melalui Tokopedia.",
  },
  {
    question: "Apakah stok barang selalu tersedia?",
    answer: "Stok bisa berubah sewaktu-waktu karena kami juga menjual langsung di toko. Mohon tanyakan ketersediaan barang via Whatsapp sebelum melakukan pemesanan.",
  },
  {
    question: "Apakah harga bisa nego?",
    answer: "Bisa, terutama untuk pembelian langsung melalui toko. Hubungi kami via Whatsapp untuk info harga terbaik.",
  },
  {
    question: "Apa bedanya Harga Offline dan Pricelist?",
    answer: "Pricelist adalah harga resmi dari brand atau distributor. Harga Offline adalah harga spesial dari toko kami, biasanya lebih hemat dari pricelist.",
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    answer: "Kami menerima transfer bank dan pembayaran langsung di toko. Untuk pembelian lewat Tokopedia, metode pembayaran mengikuti yang tersedia di Tokopedia.",
  },
  {
    question: "Berapa lama waktu pengiriman barang?",
    answer: "Pengiriman Same Day untuk area Jakarta dan Sekitarnya, di luar Jakarta tergantung dari ekspedisi.",
  },
  {
    question: "Apakah barang dikemas aman saat dikirim?",
    answer: "Ya, setiap barang kami cek terlebih dahulu dan dikemas dengan aman sebelum dikirim. Untuk alat musik yang rentan seperti gitar, kami tambahkan pelindung ekstra.",
  },
  {
    question: "Bagaimana cara klaim garansi?",
    answer: "Hubungi kami via Whatsapp dengan menyertakan bukti pembelian dan foto atau video kendala pada barang. Tim kami akan membantu proses klaim ke distributor resmi.",
  },
  {
    question: "Apakah barang bisa dikembalikan atau ditukar?",
    answer: "Barang dapat diklaim jika terdapat cacat produksi atau kesalahan pengiriman, dengan syarat kondisi barang masih lengkap bersama box dan aksesorinya. Hubungi kami via Whatsapp untuk detailnya.",
  },
];

function FaqItem({
  faq,
  index,
  openIndex,
  toggle,
}: {
  faq: { question: string; answer: string };
  index: number;
  openIndex: number | null;
  toggle: (i: number) => void;
}) {
  const answerRef = useRef<HTMLDivElement>(null);
  const isOpen = openIndex === index;

  useEffect(() => {
    const el = answerRef.current;
    if (!el) return;

    if (isOpen) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out", overwrite: true }
      );
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        overwrite: true,
      });
    }
  }, [isOpen]);

  return (
    <div className="border-b border-dashed border-third/25 first:border-t">
      <button
        onClick={() => toggle(index)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        className="group flex w-full items-center justify-between gap-4 py-4 text-left md:py-5"
      >
        <span className="flex items-start gap-3 md:gap-4">
          <span className="mt-0.5 text-[12px] font-bold tabular-nums text-second md:text-[13px]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`text-[14px] font-bold leading-snug transition-colors duration-200 md:text-[16px] ${
              isOpen ? "text-third" : "text-third/80 group-hover:text-third"
            }`}
          >
            {faq.question}
          </span>
        </span>
        <span
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm transition-all duration-300 ${
            isOpen
              ? "rotate-45 bg-second text-third"
              : "bg-third/5 text-third/60 group-hover:bg-third/10"
          }`}
        >
          <Plus size={16} strokeWidth={2.5} />
        </span>
      </button>

      <div
        id={`faq-answer-${index}`}
        ref={answerRef}
        style={{ height: 0, overflow: "hidden", opacity: 0 }}
      >
        <p className="pb-5 pl-[34px] pr-12 text-[13px] leading-relaxed text-third/70 md:pl-[42px] md:text-[14px]">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function ProductFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-14">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-third/50">
          FAQ
        </p>
        <h2 className="font-boldonse text-[clamp(18px,2.4vw,30px)] font-bold uppercase leading-[1.3] text-third">
          Ingin Bertanya <em className="not-italic text-second">Mengenai ...</em>
        </h2>
        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-third/60 md:text-[14px]">
          Pertanyaan yang paling sering kami terima. Kalau belum ketemu jawabannya, langsung tanya tim kami.
        </p>
        <a
          href="https://wa.me/6281929290560"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-sm bg-third px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-second hover:text-third active:scale-[0.98]"
        >
          <FaWhatsapp size={16} />
          Tanya via WhatsApp
        </a>
      </div>

      <div>
        {faqs.map((faq, index) => (
          <FaqItem
            key={index}
            faq={faq}
            index={index}
            openIndex={openIndex}
            toggle={toggle}
          />
        ))}
      </div>
    </section>
  );
}