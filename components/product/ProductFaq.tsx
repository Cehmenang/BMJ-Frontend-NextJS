"use client";

import { useState, useRef, useEffect } from "react";
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
    question: "Apakah harga bisa nego?",
    answer: "Bisa, terutama untuk pembelian langsung melalui toko. Hubungi kami via Whatsapp untuk info harga terbaik.",
  },
  {
    question: "Berapa lama waktu pengiriman barang?",
    answer: "Pengiriman Same Day untuk area Jakarta dan Sekitarnya, di luar Jakarta tergantung dari ekspedisi.",
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
        className="w-full flex justify-between items-center text-left gap-4 px-20"
      >
        <span className="text-[18px]">{faq.question}</span>
        <span
          className="text-gray-400 text-[18px] shrink-0 transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div ref={answerRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <p className="mt-2 text-[12px] text-gray-500 px-20">{faq.answer}</p>
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
    <div className="w-full mt-10">
      <h2 className="text-xl font-bold mb-4 text-center border-y border-third/50 py-3">Ingin Bertanya Mengenai ...</h2>
      <div className="divide-y divide-gray-200 bg-[#fefefe]">
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