"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

interface LoginWindowProps {
  setNeedLogin: Dispatch<SetStateAction<boolean>>;
}

export default function LoginWindow({ setNeedLogin }: LoginWindowProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Entrance animation
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    ).fromTo(
      panelRef.current,
      {
        opacity: 0,
        y: 40,
        scale: 0.96,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "back.out(1.6)",
      },
      "-=0.15"
    );

    // Cleanup: hentikan timeline kalau komponen unmount di tengah animasi.
    // Catatan: ini cuma kill() timeline, bukan revert() inline style —
    // cukup aman di sini karena exit animation selalu jalan duluan
    // sebelum setNeedLogin(false) dipanggil.
    return () => {
      tl.kill();
    };
  }, []);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);

    const tl = gsap.timeline({
      onComplete: () => setNeedLogin(false),
    });

    tl.to(panelRef.current, {
      opacity: 0,
      y: 30,
      scale: 0.96,
      duration: 0.3,
      ease: "power2.in",
    }).to(
      backdropRef.current,
      {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      },
      "-=0.15"
    );
  };

  const handleLoginRedirect = () => {
    if (isClosing) return;
    setIsClosing(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setNeedLogin(false);
        router.push("/login");
      },
    });

    tl.to(panelRef.current, {
      opacity: 0,
      y: -20,
      scale: 0.97,
      duration: 0.25,
      ease: "power2.in",
    }).to(
      backdropRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      "-=0.1"
    );
  };

  return (
    <div
      ref={containerRef}
      className="login-window fixed inset-0 z-[120] flex items-end justify-center sm:items-center"
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0 bg-third/70 backdrop-blur-sm opacity-0"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full sm:w-[440px] sm:max-w-[92vw] rounded-t-3xl sm:rounded-3xl bg-primary px-6 pb-8 pt-5 sm:p-8 shadow-2xl opacity-0"
      >
        {/* Drag handle (mobile only) */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-third/20 sm:hidden" />

        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 sm:right-5 sm:top-5 flex h-9 w-9 items-center justify-center rounded-full bg-third/10 text-third transition-colors hover:bg-third/20"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L15 15M15 1L1 15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Icon */}
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-second/15">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
              stroke="#f9ad52"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 17L15 12L10 7"
              stroke="#f9ad52"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 12H3"
              stroke="#f9ad52"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Content */}
        <h1 className="text-2xl sm:text-3xl font-bold text-third leading-tight">
          Login dulu, yuk!
        </h1>
        <p className="mt-2 text-sm sm:text-base text-third/70 leading-relaxed">
          Kamu perlu login untuk melihat keranjang atau melanjutkan checkout.
          Yuk masuk dulu supaya pesananmu bisa diproses.
        </p>

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-3">
          <button
            onClick={handleLoginRedirect}
            className="w-full rounded-xl bg-second px-5 py-3.5 text-sm sm:text-base font-semibold text-third transition-transform active:scale-[0.98] hover:brightness-105"
          >
            Login Sekarang
          </button>
          <button
            onClick={handleClose}
            className="w-full rounded-xl bg-transparent px-5 py-3.5 text-sm sm:text-base font-medium text-third/60 transition-colors hover:text-third"
          >
            Lanjut Belanja
          </button>
        </div>
      </div>
    </div>
  );
}