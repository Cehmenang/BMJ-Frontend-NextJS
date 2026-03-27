import axiosClient from "@/config/axios"
import axios from "axios"

export async function getProductByUrl(url: string){
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_API }/api/produk/url/${url}`)
        if(response.data) return response.data
    }catch(err){ console.log(err) }
}