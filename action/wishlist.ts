"use server"

import { cookies } from "next/headers"

export async function createWishlist(id: string, qty: number){
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    const guestId = cookieStore.get('guest_id')?.value

    const response = await fetch(`${process.env.SERVER_API}/api/wishlist`, {
        method: 'POST',
        body: JSON.stringify({ 
            product_id: id,
            quantity: qty,
            guest_id: token ? null : guestId
        }),
        headers: { 
            ...(token && { Authorization: `Bearer ${token}` }),
            Accept: 'application/json', 'Content-Type': 'application/json'
        }
    })
    if(response.ok) return true
}

export async function getWishlists(){
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value
    const guestId = cookieStore.get('guest_id')?.value
    const url = token ? `${process.env.SERVER_API}/api/wishlist` : `${process.env.SERVER_API}/api/wishlist?guest_id=${guestId}`
    
    const response = await fetch(url, { 
            method: 'GET',
            headers: { 
                ...(token && { Authorization: `Bearer ${token}` }),
                Accept: 'application/json'
            }
    })
    if(response.ok) return await response.json()
}

export async function removeWishlist(id: string){
    try{
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value
        const guestId = cookieStore.get('guest_id')?.value
        const response = await fetch(`${process.env.SERVER_API}/api/wishlist/hapus/${id}`, { method: 'GET', 
            headers: { 
                Accept: "application/json",
                ...(token && { Authorization: `Bearer ${token}` })
            } })
        if(response.ok) return true
    }catch(err){ console.log(err) }
}

export async function updateQtyWishlist(id: string, newQty: string | number){
    try{
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value
        const guestId = cookieStore.get('guest_id')?.value
        
        const response = await fetch(`${process.env.SERVER_API}/api/wishlist/update/${id}?quantity=${newQty}`, { method: 'GET', 
            headers: { 
                Accept: "application/json",
                ...(token && { Authorization: `Bearer ${token}` })
            } })
        if(response.ok) return true
    }catch(err){ console.log(err) }
}