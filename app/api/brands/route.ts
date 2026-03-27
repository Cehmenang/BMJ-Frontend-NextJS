"use server"

import axiosClient from "@/config/axios";
import { NextResponse } from "next/server";

export async function GET(){
    const response = await axiosClient.get(`/api/brand`)
    if(response.data) return NextResponse.json(response.data!)
}