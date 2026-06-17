import Link from "next/link";

export default function NotFound(){
    return (
        <div className="not-found flex justify-center items-center flex-col">
            <h1 className="text-[40px]">Halaman Tidak Ditemukan</h1>
            <p className="opacity-50 group">Kembali ke <Link href={'/'} className="group-hover:opacity-100 transition">halaman utama.</Link></p>
        </div>
    )
}