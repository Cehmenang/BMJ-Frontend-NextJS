"use server"

import axiosClient from "@/config/axios"
import { cookies } from "next/headers"

export async function login(data: { username: string, password: string }){
    try {
        const response = await axiosClient.post('api/login', data)
        if(response.data){
            const cookieStore = await cookies()
            
            cookieStore.set('access_token', response.data.api_token, {  
                httpOnly: true,
                maxAge: 3600 * 24,
                secure: true,
                sameSite: "lax"
            })

            const roleResult = await axiosClient.get('api/user/role', { 
                headers: { Authorization: `Bearer ${response.data.api_token}`, Accept: "application/json" }
            })
        
            cookieStore.set('username', response.data.user.username, {
                httpOnly: true,
                maxAge: 3600 * 24,
                secure: true,
                sameSite: 'lax'
            })

            cookieStore.set('role', roleResult.data.role, {
                httpOnly: true,
                maxAge: 3600 * 24,
                secure: true,
                sameSite: "lax"
            })

            return {
                token: cookieStore.get('access_token')!.value,
                role: cookieStore.get('role')!.value
            }
        }
    } catch(err) { 
        return err 
    }
}

export async function register(formData: any) {
    try {
        const response = await axiosClient.post('api/register', formData)
        
        console.log(response.data, 'DATAANYA')
        if (response.data) {
            const cookieStore = await cookies()
            
            // Tampung token dari Laravel (sesuaikan key-nya, kemarin lu pake api_token)
            const token = response.data.api_token; 
            const username = response.data.user?.username;
            const role = response.data.user?.role || "USER"; // Ambil dari field role model user lu

            if (token) {
                // 1. Set Cookie Token
                cookieStore.set('access_token', token, {  
                    httpOnly: true,
                    maxAge: 3600 * 24,
                    secure: true,
                    sameSite: "lax"
                })

                // 2. Set Cookie Username
                if (username) {
                    cookieStore.set('username', username, {
                        httpOnly: true,
                        maxAge: 3600 * 24,
                        secure: true,
                        sameSite: 'lax'
                    })
                }

                // 3. Set Cookie Role (Langsung ambil dari data user baru)
                cookieStore.set('role', role, {
                    httpOnly: true,
                    maxAge: 3600 * 24,
                    secure: true,
                    sameSite: "lax"
                })

                // Return data biar dibaca sama onSubmit di FE kemarin
                return { token, role }
            }
        }
        return null;
    } catch (err: any) {
        console.log("❌ ERROR PAS REGISTER:", err.response?.data || err.message);
        return null;
    }
}

export async function logOut(){
    try {
        const cookieStore = await cookies()
        const response = await axiosClient.post('api/logout', {}, {
            headers: { Authorization: `Bearer ${cookieStore.get('access_token')!.value}`, Accept: 'application/json' }
        })
        if(response.data){ 
            cookieStore.delete('access_token')
            cookieStore.delete('role')
            cookieStore.delete('username') // Sekalian bantai cookie username pas logout, bro
            return response.data
         }
    } catch(err) { 
        console.log(err) 
    }
}