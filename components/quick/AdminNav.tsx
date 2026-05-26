"use client"

import { Navigation } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const pages = [
    { text: 'Dashboard', target: '/dashboard' },
    { text: 'Upload Produk', target: '/upload/product' },
    { text: 'Upload Brand', target: '/upload/brand' },
    { text: 'Upload Kategori', target: '/upload/kategori' },
    { text: 'Produk', target: '/dashboard/products' },
    { text: 'Kategori', target: '/dashboard/kategori' },
]

export default function AdminNav(){
    const [ links, setLinks ] = useState<boolean>(false)

    return (
        <>
            <button className="diskusi fixed bottom-6 md:bottom-20 right-4 md:right-7 bg-second p-4 rounded-full z-50" onClick={()=>links ? setLinks(false) : setLinks(true)}>
                <Navigation size={40} className="white text-bold"/>
            </button>
            <div className={`fixed bottom-6 md:bottom-[200px] right-4 md:right-7 z-50 ${links ? 'translate-x-0' : 'translate-x-[280px]'} transition-all flex flex-col bg-second border-4 border-third rounded-xl`}>
                <div className="header-admin py-3 px-6 font-extrabold border-b-4 border-third bg-primary text-[18px]">Halaman</div>
                <div className="pages-admin flex flex-col">
                {pages.map(page=>{
                    return <Link href={page.target} className="hover:brightness-50 py-3 text-[18px] text-third font-bold px-6 transition">{page.text}</Link>
                })}
                </div>
            </div>
        </>
    )
}