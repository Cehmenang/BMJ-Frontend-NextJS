"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { login, register as registerAction } from "@/action/user"; 
import { useRouter } from "next/navigation";

type AuthForm = {
  username: string;
  email?: string; 
  password: string;
  confirmPassword?: string; 
};

// 🎯 FIX 1: Prop sekarang wajib menerima mode aktif dari URL page
type AuthComponentProps = {
  mode: "login" | "register"; 
};

export default function AuthComponent({ mode }: AuthComponentProps) {
  // 🎯 FIX 2: isLogin sekarang murni variabel biasa, gak pake useState lagi!
  const isLogin = mode === "login"; 
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset, 
    formState: { errors },
  } = useForm<AuthForm>();

  // Otomatis reset inputan form kalau user pindah halaman via URL
  useEffect(() => {
    reset();
  }, [mode, reset]);

  const passwordValue = watch("password");

  const onSubmit = async (data: AuthForm) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        const res = await login({ username: data.username, password: data.password }) as { token: string, role: string };
        if (res?.token) {
          window.location.href = res.role === "ADMIN" ? '/dashboard' : '/';
        }
      } else {
        const res = await registerAction({
          username: data.username,
          email: data.email,
          password: data.password
        }) as { token?: string, role?: string };
        
        if (res && res.token) {
          window.location.href = res.role === "ADMIN" ? '/dashboard' : '/';
        }
      }
    } catch (e) {
      console.error("Auth Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google auth trigger");
  };

  return (
    <div className="min-h-screen bg-bg-site flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center w-full px-4 sm:px-8 md:px-16 lg:px-24 py-10">
        <div className="main-wrapper w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_1.3fr] lg:grid-cols-[1fr_1.8fr] border border-third/10 md:border-black rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-xl md:mt-6">
          
          {/* Kiri: Image Field */}
          <div className="img-field bg-second hidden md:block min-h-[450px] relative"></div>

          {/* Kanan: Form Field */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 lg:p-16 w-full bg-bg-site">
            <Link href="/" className="flex items-center gap-2 mb-4 md:mb-6 pt-2">
              <img src="/BMJLogo.webp" width={95} className="md:w-[110px] h-auto" alt="Logo BMJ" />
            </Link>

            <div className="text-center mb-6 md:mb-8">
              <h1 className="font-poppins text-[clamp(32px,5vw,54px)] font-extrabold text-third leading-none tracking-tight mb-2.5 md:mb-4">
                {isLogin ? "Masuk" : "Daftar"}
              </h1>
              <p className="font-poppins text-[12px] md:text-[13px] text-third/50 max-w-xs leading-relaxed mx-auto px-4">
                {isLogin 
                  ? "Masuk ke akun anda, untuk melakukan pembelian secara cepat dan hemat."
                  : "Buat akun baru untuk menikmati kemudahan bertransaksi di Bandar Musik Jakarta."}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[360px] sm:max-w-[400px] space-y-3.5">
              {/* Username */}
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  {...register("username", {
                    required: "Masukkan Username Anda!",
                    minLength: { value: 3, message: "Minimum Username Memuat 3 Karakter!" }
                  })}
                  className={`w-full px-4 py-3 md:py-3.5 rounded-xl border font-poppins text-[13px] text-third bg-white outline-none transition-all duration-200 focus:border-third/50 ${errors.username ? "border-red-400" : "border-third/18"}`}
                />
                {errors.username && <p className="font-poppins text-[11px] text-red-400 mt-1.5 px-1">{errors.username.message}</p>}
              </div>

              {/* Email (Hanya muncul pas mode Register) */}
              {!isLogin && (
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    {...register("email", {
                      required: "Masukkan Alamat Email Anda!",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z|a-z]{2,}$/i,
                        message: "Format Email Tidak Valid!"
                      }
                    })}
                    className={`w-full px-4 py-3 md:py-3.5 rounded-xl border font-poppins text-[13px] text-third bg-white outline-none transition-all duration-200 focus:border-third/50 ${errors.email ? "border-red-400" : "border-third/18"}`}
                  />
                  {errors.email && <p className="font-poppins text-[11px] text-red-400 mt-1.5 px-1">{errors.email.message}</p>}
                </div>
              )}

              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    {...register("password", {
                      required: "Password wajib diisi",
                      minLength: { value: 6, message: "Password minimal 6 karakter" },
                    })}
                    className={`w-full px-4 py-3 md:py-3.5 pr-11 rounded-xl border font-poppins text-[13px] text-third bg-white outline-none transition-all duration-200 focus:border-third/50 ${errors.password ? "border-red-400" : "border-third/18"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-third/35"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="font-poppins text-[11px] text-red-400 mt-1.5 px-1">{errors.password.message}</p>}
              </div>

              {/* Konfirmasi Password (Hanya muncul pas mode Register) */}
              {!isLogin && (
                <div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Konfirmasi Password"
                    autoComplete="new-password"
                    {...register("confirmPassword", {
                      required: "Konfirmasi password wajib diisi",
                      validate: (value) => value === passwordValue || "Password tidak cocok!"
                    })}
                    className={`w-full px-4 py-3 md:py-3.5 pr-11 rounded-xl border font-poppins text-[13px] text-third bg-white outline-none transition-all duration-200 focus:border-third/50 ${errors.confirmPassword ? "border-red-400" : "border-third/18"}`}
                  />
                  {errors.confirmPassword && <p className="font-poppins text-[11px] text-red-400 mt-1.5 px-1">{errors.confirmPassword.message}</p>}
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <Link href="/lupa-password" className="font-poppins text-[11.5px] text-third/45 hover:text-third/70">Lupa password?</Link>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-third text-primary font-poppins text-[13px] font-semibold tracking-[0.04em] transition-all duration-200 hover:bg-third-dark disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? "Memproses..." : (isLogin ? "MASUK" : "DAFTAR AKUN")}
              </button>

              {/* Divider & Google Auth */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-third/10" /><span className="font-poppins text-[10px] text-third/35 tracking-[0.08em]">ATAU</span><div className="flex-1 h-px bg-third/10" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3.5 rounded-xl border border-third/18 bg-white text-third font-poppins text-[13px] font-medium flex items-center justify-center gap-3 hover:bg-third/3"
              >
                {isLogin ? "Masuk dengan Google" : "Daftar dengan Google"}
              </button>
            </form>

            {/* 🎯 FIX 3: Tombol pindah mode sekarang beneran pake <Link> Next.js, bukan fungsi onClick state lagi! */}
            <p className="font-poppins text-[11px] sm:text-[12px] text-third/40 tracking-[0.06em] mt-6 md:mt-8 text-center">
              {isLogin ? "BELUM PUNYA AKUN? " : "SUDAH PUNYA AKUN? "}
              <Link
                href={isLogin ? "/register" : "/login"}
                className="text-third font-semibold underline underline-offset-2 hover:text-second transition-colors uppercase"
              >
                {isLogin ? "Daftar" : "Masuk"}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="w-full overflow-hidden bg-second py-3.5 flex-shrink-0">
        <div className="flex animate-[ticker_20s_linear_infinite] whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              {[...Array(8)].map((_, j) => (
                <span key={j} className="text-[10px] font-extrabold text-third/50 tracking-[0.15em] uppercase mx-4 sm:mx-6">Bandar Musik Jakarta</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{` @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } } `}</style>
    </div>
  );
}