import MainAuth from "@/components/auth/MainAuth";

export const metadata = {
  title: "Daftar Akun - Bandar Musik Jakarta",
  description: "Buat akun baru di Bandar Musik Jakarta secara cepat dan aman.",
};

export default function RegisterPage() {
  return <MainAuth initialMode="register" />;
}