"use server"

import { cookies } from "next/headers"

export async function createWishlist(id: string, qty: number){
    const cookieStore = await cookies()
    const response = await fetch(`${process.env.SERVER_API}/api/wishlist`, {
        method: 'POST',
        body: JSON.stringify({ product_id: id, quantity: qty }),
        headers: { 
            Authorization: `Bearer ${cookieStore.get('access_token')!.value}`, Accept: 'application/json'
         }
    })
    if(response.ok) return await response.json()
}

export async function getWishlists(token: string){
    const response = await fetch(`${process.env.SERVER_API}/api/wishlist`, { 
            method: 'GET',
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
    if(response.ok) return await response.json()
    else return null
}