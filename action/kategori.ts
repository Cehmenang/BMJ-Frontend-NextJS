'use server'

import axiosClient from "@/config/axios";

export async function getCategories(){
    try{
        const response = await axiosClient('/api/kategori')
        if(response.data) return response.data.categories
    }catch(err){ console.log(err) }
}

export async function updateCategory(id: number, title: string, tag: string[]){
     try {
      const response = await fetch(`${process.env.SERVER_API}/api/update/kategori/info/${id}`, {
        method: "POST",
        body: JSON.stringify({
          title,
          tag: tag ?? [],
        }),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        }
      })
      const data = await response.json()
      if (!response.ok) {
        console.log(data, "error")
      }
      return data
    } catch (err) {
      console.log(err)
    }
}