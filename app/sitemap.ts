// app/sitemap.ts
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.bandarmusikjakarta.com";

  // Fetch semua produk
  const produkRes = await fetch(`${process.env.SERVER_API}/api/produk/all`, { method: 'GET', headers: { 'Accept': 'application/json' } });
  const produkData = await produkRes.json();

  // Fetch semua kategori
  const kategoriRes = await fetch(`${process.env.SERVER_API}/api/kategori`, { method: 'GET', headers: { 'Accept': 'application/json' } });
  const kategoriData = await kategoriRes.json();

const produkUrls = produkData.produk.map((produk: { url: string; updated_at: string }) => ({
  url: `${baseUrl}/produk/${produk.url}`,
  lastModified: new Date(produk.updated_at),
  changeFrequency: "weekly" as const,
  priority: 0.8,
}));

  const kategoriUrls = kategoriData.categories.map((kategori: { title: string; updated_at: string }) => ({
    url: `${baseUrl}/kategori/${kategori.title}`,
    lastModified: new Date(kategori.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...kategoriUrls,
    ...produkUrls,
  ];
}