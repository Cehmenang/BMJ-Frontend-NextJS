"use client";
// components/TikTokWidget.tsx

import { useState, useEffect, useRef, MouseEvent } from "react";
import { TIKTOK_CONFIG } from "@/config/tiktok";
import type { TikTokOEmbedResponse } from "@/interface";

// ── Helpers ───────────────────────────────────────────────────────────────────

function injectEmbedScript(): void {
  const existing = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
  if (existing) existing.remove();
  const script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js";
  script.async = true;
  document.body.appendChild(script);
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function TikTokLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
    </svg>
  );
}

function ExternalLinkIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
    </svg>
  );
}

// ── VideoCard ─────────────────────────────────────────────────────────────────

interface VideoCardProps {
  videoUrl: string;
  index: number;
}

function VideoCard({ videoUrl, index }: VideoCardProps) {
  const [data, setData] = useState<TikTokOEmbedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchEmbed() {
      try {
        const res = await fetch(`/api/tiktok-embed?url=${encodeURIComponent(videoUrl)}`);
        if (!res.ok) throw new Error();
        const json: TikTokOEmbedResponse = await res.json();
        setData(json);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchEmbed();
  }, [videoUrl]);

  useEffect(() => {
    if (!data || !expanded || !embedRef.current) return;
    embedRef.current.innerHTML = data.html;
    injectEmbedScript();
  }, [data, expanded]);

  return (
    <div className="group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-black/[0.08] dark:border-white/10 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl">

      {/* Thumbnail / Embed area */}
      <div
        onClick={() => !expanded && setExpanded(true)}
        className={`relative bg-neutral-100 dark:bg-neutral-800 overflow-hidden ${expanded ? "cursor-default" : "cursor-pointer"}`}
        style={{ aspectRatio: "9/16" }}
      >
        {/* Skeleton */}
        {loading && (
          <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        )}

        {/* Error */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-400">
            <TikTokLogo size={32} />
            <span className="text-xs">Tidak dapat dimuat</span>
          </div>
        )}

        {/* Thumbnail */}
        {!loading && !error && !expanded && data?.thumbnail_url && (
          <>
            <img
              src={data.thumbnail_url}
              alt={data.title}
              className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-black/[0.18] flex items-center justify-center">
              <div className="w-13 h-13 rounded-full bg-white/[0.93] flex items-center justify-center shadow-md">
                <svg width={22} height={22} viewBox="0 0 24 24" fill="#111" className="ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        )}

        {/* Embed */}
        {expanded && (
          <div
            ref={embedRef}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
          />
        )}
      </div>

      {/* Caption */}
      {!loading && !error && data && (
        <div className="px-4 py-3.5">
          <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-2">
            {data.title}
          </p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[#fe2c55] hover:opacity-75 transition-opacity"
          >
            Lihat di TikTok →
          </a>
        </div>
      )}
    </div>
  );
}

// ── ProfileCard ───────────────────────────────────────────────────────────────

interface ProfileCardProps {
  profileUrl: string;
}

function ProfileCard({ profileUrl }: ProfileCardProps) {
  const [data, setData] = useState<TikTokOEmbedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/tiktok-embed?url=${encodeURIComponent(profileUrl)}`);
        if (!res.ok) throw new Error();
        const json: TikTokOEmbedResponse = await res.json();
        setData(json);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [profileUrl]);

  useEffect(() => {
    if (!data?.html || !embedRef.current) return;
    embedRef.current.innerHTML = data.html;
    injectEmbedScript();
  }, [data]);

  if (loading) {
    return <div className="h-22 rounded-2xl mb-9 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />;
  }

  if (!data) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <TikTokLogo size={20} />
          <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
            {data.author_name ?? "Profil TikTok"}
          </span>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[#fe2c55] font-medium text-[18px] hover:opacity-75 transition-opacity"
        >
          Buka profil
          <ExternalLinkIcon />
        </a>
      </div>

      <div
        ref={embedRef}
        className="rounded-2xl overflow-hidden border border-black/[0.08] dark:border-white/10"
      />
    </div>
  );
}

// ── Main Widget ───────────────────────────────────────────────────────────────

export default function TikTokWidget() {
  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 font-sans">
      <ProfileCard profileUrl={TIKTOK_CONFIG.profileUrl} />

      {/* Section label */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-400 whitespace-nowrap">
          Video terbaru
        </span>
        <div className="flex-1 h-px bg-black/[0.08] dark:bg-white/10" />
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 md:grid-cols-5 md:gap-[18px]">
        {TIKTOK_CONFIG.videoUrls.map((url, i) => (
          <VideoCard key={url} videoUrl={url} index={i} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-7 pt-5 border-t border-black/[0.08] dark:border-white/10 flex justify-center">
        <a
          href={TIKTOK_CONFIG.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[18px] font-semibold text-neutral-900 dark:text-neutral-100 no-underline px-6 py-2.5 rounded-full border-[1.5px] border-black/[0.08] dark:border-white/10 transition-colors duration-150 hover:border-[#fe2c55] hover:text-[#fe2c55]"
        >
          <TikTokLogo size={20} />
          Lihat semua video
        </a>
      </div>
    </div>
  );
}