"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { login } from "@/action/user";
import { useRouter } from "next/navigation";

type LoginForm = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
        const { token, role } = await login(data) as { token: string, role: string };
        if(token){
            router.refresh();
            role == "ADMIN" ? router.push('/dashboard') : router.push('/');
        }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: redirect ke Google OAuth Laravel
    // window.location.href = `${process.env.NEXT_PUBLIC_SERVER_API}/auth/google`
    console.log("Google login");
  };

  return (
    <div className="min-h-screen bg-bg-site flex flex-col justify-between">

      {/* Main content wrapper */}
      <div className="flex-1 flex items-center justify-center w-full px-4 sm:px-8 md:px-16 lg:px-24 py-10">
        
        {/* Main Card Layout */}
        <div className="main-wrapper w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_1.3fr] lg:grid-cols-[1fr_1.8fr] border border-third/10 md:border-black rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-xl md:mt-6">
          
          {/* Column Kiri: Image Field (Hanya muncul di Desktop / md ke atas) */}
          <div className="img-field bg-second hidden md:block min-h-[450px] relative">
            {/* Lu bisa taruh bckground image penunjang di sini */}
          </div>

          {/* Column Kanan: Form Field (Selalu muncul & full width di HP) */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 lg:p-16 w-full bg-bg-site">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-4 md:mb-6 pt-2">
              <img src="/BMJLogo.webp" width={95} className="md:w-[110px] h-auto" alt="Logo BMJ" />
            </Link>

            {/* Heading */}
            <div className="text-center mb-6 md:mb-8">
              <h1 className="font-poppins text-[clamp(32px,5vw,54px)] font-extrabold text-third leading-none tracking-tight mb-2.5 md:mb-4">
                Login
              </h1>
              <p className="font-poppins text-[12px] md:text-[13px] text-third/50 max-w-xs leading-relaxed mx-auto px-4">
                Masuk ke akun anda, untuk melakukan pembelian secara cepat dan hemat.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-[360px] sm:max-w-[400px] space-y-3.5"
            >
              {/* Username */}
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  {...register("username", {
                    required: "Masukkan Username Anda!",
                    minLength: {
                        value: 5,
                        message: "Minimum Username Memuat 5 Karakter!"
                    }
                  })}
                  className={`w-full px-4 py-3 md:py-3.5 rounded-xl border font-poppins text-[13px] text-third bg-white placeholder:text-third/35 outline-none transition-all duration-200 focus:border-third/50 focus:shadow-[0_0_0_3px_rgba(62,63,32,0.06)] ${
                    errors.username ? "border-red-400" : "border-third/18"
                  }`}
                />
                {errors.username && (
                  <p className="font-poppins text-[11px] text-red-400 mt-1.5 px-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    {...register("password", {
                      required: "Password wajib diisi",
                      minLength: {
                        value: 6,
                        message: "Password minimal 6 karakter",
                      },
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
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="font-poppins text-[11px] text-red-400 mt-1.5 px-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  href="/lupa-password"
                  className="font-poppins text-[11.5px] text-third/45 hover:text-third/70 transition-colors"
                >
                  Lupa password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-third text-primary font-poppins text-[13px] font-semibold tracking-[0.04em] transition-all duration-200 hover:bg-third-dark disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  "MASUK"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-third/10" />
                <span className="font-poppins text-[10px] text-third/35 tracking-[0.08em]">ATAU</span>
                <div className="flex-1 h-px bg-third/10" />
              </div>

              {/* Google login */}
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
                Masuk dengan Google
              </button>
            </form>

            {/* Register link */}
            <p className="font-poppins text-[11px] sm:text-[12px] text-third/40 tracking-[0.06em] mt-6 md:mt-8 text-center">
              BELUM PUNYA AKUN?{" "}
              <Link
                href="/register"
                className="text-third font-semibold underline underline-offset-2 hover:text-second transition-colors"
              >
                DAFTAR
              </Link>
            </p>
          </div>
          
        </div>
      </div>

      {/* Infinite scroll ticker */}
      <div className="w-full overflow-hidden bg-second py-3.5 flex-shrink-0">
        <div className="flex animate-[ticker_20s_linear_infinite] whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              {[...Array(8)].map((_, j) => (
                <span
                  key={j}
                  className="text-[10px] font-extrabold text-third/50 tracking-[0.15em] uppercase mx-4 sm:mx-6"
                >
                  Bandar Musik Jakarta
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Ticker animation */}
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}