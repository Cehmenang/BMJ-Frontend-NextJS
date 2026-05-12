"use client"

import { Navigation } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const pages = [
    { text: 'Dashboard', target: '/dashboard' },
    { text: 'Upload Produk', target: '/upload/product' },
    { text: 'Upload Brand', target: '/upload/brand' },
]

export default function AdminNav(){
    const [ links, setLinks ] = useState<boolean>(false)

    return (
        <>
            <button className="diskusi fixed bottom-6 md:bottom-20 right-4 md:right-7 bg-second p-4 rounded-full z-50" onClick={()=>links ? setLinks(false) : setLinks(true)}>
                <Navigation size={20} className="white"/>
            </button>
            <div className={`fixed bottom-6 md:bottom-[200px] right-4 md:right-7 z-50 ${links ? 'translate-x-0' : 'translate-x-[200px]'} transition-all flex flex-col bg-second border-2 border-third p-3 rounded-md`}>
                <div className="header-admin">Halaman</div>
                <div className="pages-admin flex flex-col">
                {pages.map(page=>{
                    return <Link href={page.target} className="py-2 text-[18px] bg-primary text-third font-bold">{page.text}</Link>
                })}
                </div>
            </div>
        </>
    )
}