// app/api/tiktok-embed/route.ts
import { TikTokOEmbedResponse } from "@/interface";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL wajib diisi" }, { status: 400 });
  }

  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;

    const res = await fetch(oembedUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) {
      throw new Error(`TikTok oEmbed error: ${res.status}`);
    }

    const data: TikTokOEmbedResponse = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("oEmbed fetch error:", err);
    return NextResponse.json({ error: "Gagal fetch embed" }, { status: 500 });
  }
}