'use server'

import axiosClient from "@/config/axios";

export async function getCategories(){
    try{
        const response = await axiosClient('/api/kategori')
        if(response.data) return response.data.categories
    }catch(err){ console.log(err) }
}

export async function updateCategory(title: string, tag: string[]){
     try {
      const response = await fetch(`${process.env.SERVER_API}/api/update/kategori/info/${title}`, {
        method: "POST",
        body: JSON.stringify({
          tag: tag ?? [],
        }),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        }
      })
      const data = await response.json()
      if (!response.ok) {
        return { message: 'RESPONSE FAILED!' }
      }
      return data
    } catch (err) {
      console.log(err)
    }
}

export async function uploadKategori(formData: FormData){
  try{
    const response = await fetch(`${process.env.SERVER_API}/api/tambah/kategori`, {
      method: 'POST', headers: { "Accept": "application/json" }, body: formData
    })
    const data = await response.json()
    if(response.ok){ return data }
  }catch(err){ console.log(err) }
}

export async function getSelectedCategories(name: string){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/selected/kategori/${name}`,{
            method: 'GET',
            headers: { 'Content-Type': "application/json" },
        })
        const categories = await response.json()
        if(response.ok){ return categories }
    }catch(err){ console.log(err) }
}