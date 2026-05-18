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
    return response
}