"use server"

import { cookies } from "next/headers"
import MainContact from "./MainContact"
import AdminNav from "./AdminNav"

export default async function QuickAction(){
    const cookieStore = await cookies()
    const role = await cookieStore.get('role')?.value as string || null

    return role?.toLocaleLowerCase() == "admin" ? <AdminNav/> : <MainContact/>
}