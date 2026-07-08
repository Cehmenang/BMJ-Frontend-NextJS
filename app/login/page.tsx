import MainAuth from "@/components/auth/MainAuth";

export const metadata = {
  title: "Masuk - Bandar Musik Jakarta",
  description: "Masuk ke akun Anda di Bandar Musik Jakarta untuk kemudahan bertransaksi.",
};

export default function LoginPage() {
  return <MainAuth mode="login" />;
}