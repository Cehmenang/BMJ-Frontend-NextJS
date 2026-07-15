"use server"

import { getPromosName } from "@/action/product";
import MainFooter from "./MainFooter";

export default async function LayoutFooter(){
    const promos = await getPromosName()

    return (
        <MainFooter promos={promos}/>
    )
}