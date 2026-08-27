"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { IProduct } from "@/interface";
import { removeWishlist, updateQtyWishlist } from "@/action/wishlist";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  product_id: string;
  produk: IProduct;
  quantity: number;
  updated_at: string;
  created_at: string;
  user_id: string;
};

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

type CartSidebarProps = {
  open: boolean;
  onClose: () => void;
  wishlist: any[],
  setNeedLogin: React.SetStateAction<any>
};

export default function CartSidebar({ open, onClose, wishlist, setNeedLogin }: CartSidebarProps) {
  const [items, setItems] = useState<CartItem[]>(wishlist);
  const [isLoading, setIsLoading] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(false)
  const router = useRouter();

  useEffect(()=>{
    const cookies = document.cookie.split(';')
    const username = cookies.filter(cookie=>cookie.includes("username"))[0]
    setIsLogin(username ? true : false)
  }, [])

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setItems(wishlist);
  }, [wishlist]);

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

  const updateQty = async (id: string, delta: number) => {
    const targetItem = items.find(item => item.id === id);
    if (!targetItem) return;
    const newQty = Math.max(1, targetItem.quantity + delta);

    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, quantity: newQty } : item)
    );

    await updateQtyWishlist(id, newQty);
    router.refresh();
  };

  const removeItem = async (id: string) => {
    setIsLoading(true);
    const success = await removeWishlist(id);

    if (success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    }
    setIsLoading(false);
  };

  const subtotal = items.reduce((sum, item) => sum + parseInt(item.produk.offlinePrice) * item.quantity, 0);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

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
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] z-50 bg-primary flex flex-col transition-transform duration-350 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header — "X ITEMS IN YOUR BAG" style */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-third/10 flex-shrink-0">
          <h2 className="font-poppins text-[15px] font-extrabold text-third uppercase tracking-[0.06em]">
            {items.length} {items.length === 1 ? "Item" : "Items"} di Keranjang
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-third/15 flex items-center justify-center text-third/60 hover:text-third hover:bg-third/8 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
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
            <div className="px-6 py-5 space-y-6">
              {items.map((item) => {
                return (
                <div key={item.id} className="flex gap-4 opacity-100 data-[loading=true]:opacity-50 transition-opacity">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-third/5 border border-third/8 flex-shrink-0">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SERVER_API}/storage/${item.produk.images[0]}`}
                      alt={item.produk.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1 flex flex-col">
                    {/* Nama + harga sejajar seperti contoh */}
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/produk/${item.produk.url}`}
                        className="font-poppins text-[13px] font-extrabold text-third uppercase leading-snug line-clamp-2 hover:opacity-70 transition"
                      >
                        {item.produk.name}
                      </Link>
                      <p className="font-poppins text-[13px] font-bold text-third whitespace-nowrap">
                        {formatRp(parseInt(item.produk.offlinePrice))}
                      </p>
                    </div>

                    <p className="font-poppins text-[10.5px] text-third/40 mt-0.5">
                      {item.produk.brandId}
                    </p>

                    {/* Qty stepper */}
                    <div className="flex items-center gap-0 border border-third/15 rounded-full overflow-hidden mt-2.5 w-fit">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        disabled={item.quantity <= 1 || isLoading}
                        className="w-7 h-7 flex items-center justify-center text-third/60 hover:text-third hover:bg-third/6 transition-colors disabled:opacity-30 disabled:cursor-default"
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span className="w-8 text-center font-poppins text-[12px] font-semibold text-third border-x border-third/15">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        disabled={isLoading}
                        className="w-7 h-7 flex items-center justify-center text-third/60 hover:text-third hover:bg-third/6 transition-colors"
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>

                    {/* Remove — uppercase text link seperti "REMOVE" */}
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      className="mt-2.5 self-start font-poppins text-[10.5px] font-bold uppercase tracking-[0.04em] text-third/40 hover:text-red-400 transition-colors disabled:opacity-40"
                    >
                      {isLoading ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
                )})}
            </div>
          )}
        </div>

        {/* Footer — subtotal + shipping + 2 tombol terpisah */}
        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-third/10 px-6 py-5 space-y-4 bg-primary">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-poppins text-[12px] font-semibold text-third/60 uppercase tracking-[0.03em]">
                  Subtotal ({totalQty} item)
                </span>
                <span className="font-poppins text-[14px] font-extrabold text-third">
                  {formatRp(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-poppins text-[12px] font-semibold text-third/60 uppercase tracking-[0.03em]">
                  Ongkos Kirim
                </span>
                <span className="font-poppins text-[11.5px] text-third/45">
                  Dihitung saat checkout
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-third text-primary font-poppins text-[13px] font-bold uppercase tracking-[0.03em] flex items-center justify-center gap-2 hover:bg-third-dark transition-colors"
              >
                Checkout Sekarang
              </Link>
              <Link
                href={`${isLogin ? "/keranjang" : ""}`}
                onClick={isLogin ? onClose : ()=>setNeedLogin(true)}
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