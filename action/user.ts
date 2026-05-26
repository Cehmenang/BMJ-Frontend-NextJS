"use server"

import axiosClient from "@/config/axios"
import { cookies } from "next/headers"

export async function login(data: { username: string, password: string }){
    try{
        const response = await axiosClient.post('api/login', data)
        if(response.data){
             const cookieStore = await cookies()
                cookieStore.set('access_token', response.data.api_token,{  
                    httpOnly: true,
                    maxAge: 3600 * 24,
                    secure: true,
                    sameSite: "lax"
                })

            const roleResult = await axiosClient.get('api/user/role', { headers: 
                { Authorization: `Bearer ${response.data.api_token}`, Accept: "application/json" }
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

    }catch(err){ return err }
}

export async function logOut(){
    try{
        const cookieStore = await cookies()
        const response = await axiosClient.post('api/logout',{},{
            headers: { Authorization: `Bearer ${cookieStore.get('access_token')!.value}`, Accept: 'application/json' }
        })
        if(response.data){ 
            cookieStore.delete('access_token')
            cookieStore.delete('role')
            return response.data
         }
    }catch(err){ console.log(err) }
}