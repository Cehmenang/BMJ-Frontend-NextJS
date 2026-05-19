"use client";

import { useState } from "react";

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

export default function ProductFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Pertanyaan Umum</h2>
      <div className="divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="py-3">
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center text-left gap-4"
            >
              <span className="font-medium text-sm">{faq.question}</span>
              <span className="text-gray-400 text-lg shrink-0">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-sm text-gray-500">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}