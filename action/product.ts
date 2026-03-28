"use server"

import axios from "axios"

export async function getProductByUrl(url: string){
    try{
        const response = await axios.get(`${process.env.SERVER_API}/api/produk/url/${url}`)
        if(response.data) return response.data
    }catch(err){ console.log(err) }
}

export async function getLatestProducts(){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/produk/terbaru`, { 
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            next: { revalidate: 300 }
        })
        if(response.ok) return await response.json().then(res=>res.produk)
    }catch(err){ console.log(err) }
}