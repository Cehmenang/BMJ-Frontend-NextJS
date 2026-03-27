'use server'

import axiosClient from "@/config/axios"

export async function getBrands(){
    try{
        const response = await axiosClient.get('/api/brand')
        if(response.data) return response.data.brands
    }catch(err){ console.log(err) }
}