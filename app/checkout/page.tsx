import { getWishlists } from "@/action/wishlist";
import MainCheckout from "@/components/checkout/MainCheckout";
import { cookies } from "next/headers";

export default async function Checkout(){
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value as string | null
    const wishlists = await getWishlists()

    return <MainCheckout wishlists={wishlists}/>
}