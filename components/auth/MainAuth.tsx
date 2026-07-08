"use client";

import { useState } from "react";
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

type AuthComponentProps = {
  initialMode?: "login" | "register";
};

export default function MainAuth({ initialMode = "login" }: AuthComponentProps) {
  const [isLogin, setIsLogin] = useState(initialMode === "login"); 
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

  // Memantau input password utama untuk validasi kecocokan di konfirmasi password
  const passwordValue = watch("password");

  const onSubmit = async (data: AuthForm) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        // ── ALUR LOGIN BIASA ──
        const res = await login({ 
          username: data.username, 
          password: data.password 
        }) as { token: string, role: string };
        
        if (res?.token) {
          router.refresh();
          res.role === "ADMIN" ? router.push('/dashboard') : router.push('/');
        }
      } else {
        // ── ALUR REGISTER + AUTO LOGIN INSTAN ──
        const res = await registerAction({
          username: data.username,
          email: data.email,
          password: data.password
        }) as { token?: string, role?: string };
        
        // Jika backend sukses bikin akun & ngasih token, langsung bypass masuk!
        if (res && res.token) {
          router.refresh();
          res.role === "ADMIN" ? router.push('/dashboard') : router.push('/');
        }
      }
    } catch (e) {
      console.error("Auth Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // window.location.href = `${process.env.NEXT_PUBLIC_SERVER_API}/auth/google`
    console.log("Google auth trigger");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset(); // Bersihkan form dan sisa error validation saat pindah mode
  };

  return (
    <div className="min-h-screen bg-bg-site flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center w-full px-4 sm:px-8 md:px-16 lg:px-24 py-10">
        <div className="main-wrapper w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_1.3fr] lg:grid-cols-[1fr_1.8fr] border border-third/10 md:border-black rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-xl md:mt-6">
          
          {/* Kiri: Image Field (Hanya muncul di Desktop) */}
          <div className="img-field bg-second hidden md:block min-h-[450px] relative">
            {/* Sisi visual estetik e-commerce */}
          </div>

          {/* Kanan: Form Field */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 lg:p-16 w-full bg-bg-site">
            <Link href="/" className="flex items-center gap-2 mb-4 md:mb-6 pt-2">
              <img src="/BMJLogo.webp" width={95} className="md:w-[110px] h-auto" alt="Logo BMJ" />
            </Link>

            {/* Heading Dinamis */}
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

            {/* Form */}
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
                  className={`w-full px-4 py-3 md:py-3.5 rounded-xl border font-poppins text-[13px] text-third bg-white placeholder:text-third/35 outline-none transition-all duration-200 focus:border-third/50 focus:shadow-[0_0_0_3px_rgba(62,63,32,0.06)] ${
                    errors.username ? "border-red-400" : "border-third/18"
                  }`}
                />
                {errors.username && <p className="font-poppins text-[11px] text-red-400 mt-1.5 px-1">{errors.username.message}</p>}
              </div>

              {/* Email Field (Otomatis Hilang/Muncul) */}
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
                    className={`w-full px-4 py-3 md:py-3.5 rounded-xl border font-poppins text-[13px] text-third bg-white placeholder:text-third/35 outline-none transition-all duration-200 focus:border-third/50 focus:shadow-[0_0_0_3px_rgba(62,63,32,0.06)] ${
                      errors.email ? "border-red-400" : "border-third/18"
                    }`}
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
                    className={`w-full px-4 py-3 md:py-3.5 pr-11 rounded-xl border font-poppins text-[13px] text-third bg-white placeholder:text-third/35 outline-none transition-all duration-200 focus:border-third/50 focus:shadow-[0_0_0_3px_rgba(62,63,32,0.06)] ${
                      errors.password ? "border-red-400" : "border-third/18"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-third/35 hover:text-third/70 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="font-poppins text-[11px] text-red-400 mt-1.5 px-1">{errors.password.message}</p>}
              </div>

              {/* Konfirmasi Password Field (Otomatis Hilang/Muncul) */}
              {!isLogin && (
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Konfirmasi Password"
                      autoComplete="new-password"
                      {...register("confirmPassword", {
                        required: "Konfirmasi password wajib diisi",
                        validate: (value) => value === passwordValue || "Password tidak cocok!"
                      })}
                      className={`w-full px-4 py-3 md:py-3.5 pr-11 rounded-xl border font-poppins text-[13px] text-third bg-white placeholder:text-third/35 outline-none transition-all duration-200 focus:border-third/50 focus:shadow-[0_0_0_3px_rgba(62,63,32,0.06)] ${
                        errors.confirmPassword ? "border-red-400" : "border-third/18"
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="font-poppins text-[11px] text-red-400 mt-1.5 px-1">{errors.confirmPassword.message}</p>}
                </div>
              )}

              {/* Lupa password (Hanya di mode Login) */}
              {isLogin && (
                <div className="flex justify-end">
                  <Link href="/lupa-password" className="font-poppins text-[11.5px] text-third/45 hover:text-third/70 transition-colors">
                    Lupa password?
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-third text-primary font-poppins text-[13px] font-semibold tracking-[0.04em] transition-all duration-200 hover:bg-third-dark disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  isLogin ? "MASUK" : "DAFTAR AKUN"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-third/10" />
                <span className="font-poppins text-[10px] text-third/35 tracking-[0.08em]">ATAU</span>
                <div className="flex-1 h-px bg-third/10" />
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3.5 rounded-xl border border-third/18 bg-white text-third font-poppins text-[13px] font-medium flex items-center justify-center gap-3 hover:border-third/35 hover:bg-third/3 transition-all duration-200"
              >
                <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {isLogin ? "Masuk dengan Google" : "Daftar dengan Google"}
              </button>
            </form>

            {/* Switch Mode */}
            <p className="font-poppins text-[11px] sm:text-[12px] text-third/40 tracking-[0.06em] mt-6 md:mt-8 text-center">
              {isLogin ? "BELUM PUNYA AKUN? " : "SUDAH PUNYA AKUN? "}
              <button
                onClick={toggleMode}
                className="text-third font-semibold underline underline-offset-2 hover:text-second transition-colors uppercase"
              >
                {isLogin ? "Daftar" : "Masuk"}
              </button>
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
                <span key={j} className="text-[10px] font-extrabold text-third/50 tracking-[0.15em] uppercase mx-4 sm:mx-6">
                  Bandar Musik Jakarta
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}