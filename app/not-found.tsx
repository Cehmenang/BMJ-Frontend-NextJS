import Link from "next/link";

export default function NotFound(){
    return (
        <div className="not-found h-dvh flex justify-center items-center flex-col">
            <h1 className="text-[40px]">Halaman Tidak Ditemukan</h1>
            <div>
                <p className="opacity-50">Kembali ke </p>
                <Link href={'/'} className="group-hover:opacity-100 transition underline">halaman utama.</Link></div>
        </div>
    )
}