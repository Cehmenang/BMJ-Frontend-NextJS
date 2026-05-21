"use client";
// components/TikTokWidget.tsx

import { useState, useEffect, useRef, MouseEvent } from "react";
import { TIKTOK_CONFIG } from "@/config/tiktok";
import { TikTokOEmbedResponse } from "@/interface";

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

  function handleMouseEnter(e: MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
  }

  function handleMouseLeave(e: MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.transform = "";
    e.currentTarget.style.boxShadow = "";
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: "var(--card-bg)",
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid var(--border-color)",
        transition: "transform 0.22s cubic-bezier(.4,0,.2,1), box-shadow 0.22s cubic-bezier(.4,0,.2,1)",
        animation: `fadeUp 0.4s cubic-bezier(.4,0,.2,1) ${index * 80}ms both`,
      }}
    >
      {/* Thumbnail / Embed area */}
      <div
        onClick={() => !expanded && setExpanded(true)}
        style={{
          position: "relative",
          aspectRatio: "9/16",
          background: "var(--thumb-bg)",
          cursor: expanded ? "default" : "pointer",
          overflow: "hidden",
        }}
      >
        {loading && (
          <div style={{
            position: "absolute", inset: 0,
            background: "var(--thumb-bg)",
            animation: "shimmer 1.4s ease-in-out infinite",
          }} />
        )}

        {error && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 8, color: "var(--muted)",
          }}>
            <TikTokLogo size={32} />
            <span style={{ fontSize: 12 }}>Tidak dapat dimuat</span>
          </div>
        )}

        {!loading && !error && !expanded && data?.thumbnail_url && (
          <>
            <img
              src={data.thumbnail_url}
              alt={data.title}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", display: "block",
                transition: "transform 0.35s ease",
              }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "rgba(255,255,255,0.93)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width={22} height={22} viewBox="0 0 24 24" fill="#111" style={{ marginLeft: 3 }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        )}

        {expanded && (
          <div
            ref={embedRef}
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}
          />
        )}
      </div>

      {/* Caption */}
      {!loading && !error && data && (
        <div style={{ padding: "14px 16px 16px" }}>
          <p style={{
            margin: "0 0 10px", fontSize: 13,
            lineHeight: 1.55,
            color: "var(--text-secondary)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {data.title}
          </p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12, color: "var(--accent)",
              textDecoration: "none", fontWeight: 500,
            }}
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
    return (
      <div style={{
        height: 88, borderRadius: 16, marginBottom: 36,
        background: "var(--thumb-bg)",
        animation: "shimmer 1.4s ease-in-out infinite",
      }} />
    );
  }

  if (!data) return null;

  return (
    <div style={{
      marginBottom: 40,
      animation: "fadeUp 0.35s cubic-bezier(.4,0,.2,1) both",
    }}>
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TikTokLogo size={16} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.02em" }}>
            {data.author_name ?? "Profil TikTok"}
          </span>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12, color: "var(--accent)",
            textDecoration: "none", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 4,
          }}
        >
          Buka profil
          <ExternalLinkIcon />
        </a>
      </div>

      <div
        ref={embedRef}
        style={{
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid var(--border-color)",
        }}
      />
    </div>
  );
}

// ── Main Widget ───────────────────────────────────────────────────────────────

export default function TikTokWidget() {
  const css = `
    :root {
      --accent: #fe2c55;
      --card-bg: #ffffff;
      --border-color: rgba(0,0,0,0.08);
      --text-primary: #0f0f0f;
      --text-secondary: #555;
      --muted: #999;
      --thumb-bg: #f0f0f0;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --card-bg: #1a1a1a;
        --border-color: rgba(255,255,255,0.1);
        --text-primary: #f0f0f0;
        --text-secondary: #aaa;
        --muted: #666;
        --thumb-bg: #2a2a2a;
      }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.5; }
    }
    .tiktok-videos-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }
    @media (max-width: 640px) {
      .tiktok-videos-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
    }
    @media (max-width: 400px) {
      .tiktok-videos-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 16px",
        boxSizing: "border-box",
      }}>
        <ProfileCard profileUrl={TIKTOK_CONFIG.profileUrl} />

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted)",
            whiteSpace: "nowrap",
          }}>
            Video terbaru
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
        </div>

        {/* Video grid — responsive via CSS class */}
        <div className="tiktok-videos-grid">
          {TIKTOK_CONFIG.videoUrls.map((url, i) => (
            <VideoCard key={url} videoUrl={url} index={i} />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 28,
          paddingTop: 20,
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "center",
        }}>
          <a
            href={TIKTOK_CONFIG.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 600,
              color: "var(--text-primary)",
              textDecoration: "none",
              padding: "10px 24px",
              borderRadius: 50,
              border: "1.5px solid var(--border-color)",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
          >
            <TikTokLogo size={15} />
            Lihat semua video
          </a>
        </div>
      </div>
    </>
  );
}