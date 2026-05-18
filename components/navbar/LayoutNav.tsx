"use server"

import { cookies } from 'next/headers';
import MainNav from './MainNav';
import { getWishlists } from '@/action/wishlist';

export default async function LayoutNav() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value as string | null
  const username = cookieStore.get('username')?.value as string | null

  const wishlist = token ? await getWishlists(token) : null

  return <MainNav token={token} username={username} wishlist={wishlist}/>
}