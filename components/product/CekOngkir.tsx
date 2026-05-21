"use client"

import { getDestinationOption } from "@/action/product";

export default function cekOngkir(){

    async function handleDestinationOption(e: any){
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const location = form.get('destination') as string
        console.log(location, 'TEMPAATTT')
        if (location?.trim()) {
            const data = await getDestinationOption(location)
            console.log(data.json())
        }
    }

    return (
        <div className="bg-ongkir-overlay fixed flex justify-center items-center top-0 left-0 w-[100%] h-dvh bg-third/50">
            <div className="form-ongkir bg-primary">
                <form onSubmit={handleDestinationOption}>
                    <input type="text" name="destination" placeholder="Kota/Kecamatan Tujuan"/>
                    <button type="submit">Cari Lokasi</button>
                </form>
            </div>
        </div>
    )
}