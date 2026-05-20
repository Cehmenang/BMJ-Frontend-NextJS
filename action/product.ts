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

export async function getProductByBrand(brandName: string, pagination: number){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/produk/brand/${brandName}?page=${pagination}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
            next: { revalidate: 300 }
        })
        const result= await response.json()
        if(response.ok) {
            return await result.produk
        }
    }catch(err){ console.log(err) }
}

export async function getProductByCategory(kategoriName: string, pagination: number){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/produk/kategori/${kategoriName}?page=${pagination}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
            next: { revalidate: 300 }
        })
        const result= await response.json()
        if(response.ok) {
            return await result.produk
        }
    }catch(err){ console.log(err) }
}

export async function uploadProduct(formData: FormData){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/tambah/produk`, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
        return await response.json()
    }catch(err){ console.log(err) }
}

export async function getProducts(pagination: number){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/produk/semua?page=${pagination}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
            next: { revalidate: 300 }
        })
        const result= await response.json()
        if(response.ok) {
            return await result.produk
        }
    }catch(err){ console.log(err) }
}

export async function getRelated(kategori? : string){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/produk/related?kategori=${kategori}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
        })
        const result= await response.json()
        if(response.ok) {
            return await result.produk
        }
    }catch(err){ console.log(err) }
}

export async function getProductsBySearch(pagination: number, query: string){
    try{
        const response = await fetch(`${process.env.SERVER_API}/api/produk/semua?page=${pagination}&q=${query}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', "Accept": "application/json" },
            cache: "no-store"
        })
        const result= await response.json()
        if(response.ok) {
            return await result.produk
        }
    }catch(err){ console.log(err) }
}

export async function saveProduct(formData: any, url: string){
    try{
        await fetch(`${process.env.SERVER_API}/api/update/quick/produk/${url}`, {
            method: "POST", 
            body: formData,
            headers: { "Accept": "application/json" }
        })
    }catch(err){
        return err
    }
}