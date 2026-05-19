"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const faqs = [
  {
    question: "Apakah produk ini original?",
    answer: "Ya, semua produk di Bandar Musik Jakarta 100% original dan bergaransi resmi 1 tahun.",
  },
  {
    question: "Bagaimana cara pembelian?",
    answer: "Pembelian bisa dilakukan langsung di toko atau via Whatsapp di 081929290560. Kami juga tersedia di Tokopedia.",
  },
  {
    question: "Apakah harga bisa nego?",
    answer: "Bisa, terutama untuk pembelian langsung di toko. Hubungi kami via Whatsapp untuk info harga terbaik.",
  },
  {
    question: "Berapa lama pengiriman?",
    answer: "Pengiriman same day untuk area Jakarta, 2-3 hari untuk luar Jakarta tergantung ekspedisi.",
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
        { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" }
      );
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  return (
    <div className="py-3">
      <button
        onClick={() => toggle(index)}
        className="w-full flex justify-between items-center text-left gap-4"
      >
        <span className="font-medium text-sm">{faq.question}</span>
        <span
          className="text-gray-400 text-lg shrink-0 transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div ref={answerRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <p className="mt-2 text-sm text-gray-500">{faq.answer}</p>
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
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Pertanyaan Umum</h2>
      <div className="divide-y divide-gray-200">
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
    </div>
  );
}