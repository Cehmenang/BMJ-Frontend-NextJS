"use server"

import { cookies } from "next/headers"

export default async function AdminNav(){
    const cookieStore = await cookies()
    const isAdmin = cookieStore.get('role')?.value == "ADMIN" ? true : false

    if(isAdmin) {
        return (
            <h1 className="w-full bg-second fixed top-50 left-0">ADMIN NAVBAR</h1>
        )
    }
}