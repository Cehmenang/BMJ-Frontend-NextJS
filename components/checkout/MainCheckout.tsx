"use client"

import { useEffect } from "react"

export default function MainCheckout({ wishlists }: { wishlists: any[] }){
    useEffect(()=>{
        console.log(wishlists)
    }, [])

    return (
        <div className="main-checkout">
            <h1>Main Checkout</h1>
        </div>
    )
}