"use client"

import { getDestinationOption } from "@/action/product"
import { useState } from "react"

export default function cekOngkir(){
    const [destInput, setDestInput] = useState<string>('')

    async function ambilDest(destInput: string){
        const data = await getDestinationOption(destInput!)
        console.log(data)
    }

    return (
        <div className="bg-ongkir-overlay fixed flex justify-center items-center top-0 left-0 w-[100%] h-dvh bg-third/50">
            <div className="form-ongkir bg-primary">
                <input type="text" name="destination" placeholder="Kota/Kecamatan Tujuan" onChange={(e)=>setDestInput(e.target.value)}/>
                <button onClick={()=>{ 
                    if(destInput && destInput.trim() !== ""){
                        ambilDest(destInput)
                    }
                }}>Cari Lokasi</button>
            </div>
        </div>
    )
}