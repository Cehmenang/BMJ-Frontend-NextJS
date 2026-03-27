'use server'

import axiosClient from "@/config/axios";

export async function getCategories(){
    try{
        const response = await axiosClient('/api/kategori')
        if(response.data) return response.data.categories
    }catch(err){ console.log(err) }
}