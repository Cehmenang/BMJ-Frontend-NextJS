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
                maxAge: 3600,
                secure: false,
                sameSite: "lax"
            })
            return cookieStore.get('access_token')!.value
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
            return response.data
         }
    }catch(err){ console.log(err) }
}