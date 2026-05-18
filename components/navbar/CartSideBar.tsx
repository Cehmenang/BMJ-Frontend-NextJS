"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
};

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

type CartSidebarProps = {
  open: boolean;
  onClose: () => void;
  wishlist: any[]
};

export default function CartSidebar({ open, onClose, wishlist }: CartSidebarProps) {
  const [items, setItems] = useState<CartItem[]>(wishlist);
  const [isLoading, setIsLoading] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on backdrop click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (backdropRef.current && e.target === backdropRef.current) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!mounted) return null;
  return createPortal(
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 bg-primary flex flex-col transition-transform duration-350 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-third/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-[20px] font-extrabold text-third tracking-tight">
              Keranjang
            </h2>
            {items.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-second text-third text-[10px] font-bold font-poppins flex items-center justify-center">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-third/7 border border-third/10 flex items-center justify-center text-third/60 hover:text-third hover:bg-third/12 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-third/6 border border-third/10 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-third/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <p className="font-poppins text-[14px] font-semibold text-third/50 mb-1">Keranjang kosong</p>
              <p className="font-poppins text-[12px] text-third/35 mb-6 leading-relaxed">
                Belum ada produk yang ditambahkan ke keranjang.
              </p>
              <button
                onClick={onClose}
                className="font-poppins text-[12.5px] font-medium px-5 py-2.5 rounded-lg bg-second text-third hover:bg-[#fbbe74] transition-colors"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-third/5 border border-third/8 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins text-[11px] text-third/40 mb-0.5">{item.brand}</p>
                    <p className="font-poppins text-[13px] font-semibold text-third leading-snug truncate">
                      {item.name}
                    </p>
                    <p className="font-poppins text-[13px] font-bold text-second mt-1">
                      {formatRp(item.price)}
                    </p>

                    {/* Qty + Remove */}
                    <div className="flex items-center justify-between mt-2.5">
                      {/* Qty controls */}
                      <div className="flex items-center gap-0 border border-third/12 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-third/60 hover:text-third hover:bg-third/6 transition-colors disabled:opacity-30 disabled:cursor-default"
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <span className="w-8 text-center font-poppins text-[12px] font-semibold text-third border-x border-third/12">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-third/60 hover:text-third hover:bg-third/6 transition-colors"
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-[11px] font-poppins text-third/35 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — subtotal + checkout */}
        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-third/10 px-6 py-5 space-y-4 bg-primary">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-poppins text-[12px] text-third/50">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} item)
                </span>
                <span className="font-poppins text-[14px] font-bold text-third">
                  {formatRp(subtotal)}
                </span>
              </div>
              <p className="font-poppins text-[11px] text-third/35 leading-relaxed">
                Belum termasuk ongkos kirim & pajak. Dihitung saat checkout.
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-third text-primary font-poppins text-[13px] font-semibold tracking-[0.02em] flex items-center justify-center gap-2 hover:bg-third-dark transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Checkout Sekarang
              </Link>
              <Link
                href="/keranjang"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-third/15 text-third font-poppins text-[12.5px] font-medium flex items-center justify-center hover:bg-third/4 transition-colors"
              >
                Lihat Keranjang
              </Link>
            </div>
          </div>
        )}
      </div>
    </>, document.body
  );
}