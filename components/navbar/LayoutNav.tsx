"use server"

import { cookies } from 'next/headers';
import MainNav from './MainNav';

export default async function LayoutNav() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value as string | null
  const username = cookieStore.get('username')?.value as string | null

  const wishlist = token ? await fetch(`${process.env.SERVER_API}/api/wishlist`, { 
    method: 'GET',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  }) : null

  return <MainNav token={token} username={username} wishlist={wishlist}/>
}