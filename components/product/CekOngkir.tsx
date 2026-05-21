"use client"

import { useState, useRef, useEffect } from "react"

interface Destination {
  id: number
  label: string
  province_name: string
  city_name: string
  district_name: string
  subdistrict_name: string
  zip_code: string
}

interface ShippingOption {
  name: string
  code: string
  service: string
  description: string
  cost: number
  etd: string
}

interface Props {
  weight: number       // total berat dalam gram
  subtotal?: number    // opsional, untuk tampilan ringkasan
  onSelect?: (option: ShippingOption) => void
}

const COURIERS = [
  { value: "all",      label: "Semua kurir" },
  { value: "jne",      label: "JNE" },
  { value: "jnt",      label: "J&T Express" },
  { value: "sicepat",  label: "SiCepat" },
  { value: "anteraja", label: "AnterAja" },
  { value: "pos",      label: "POS Indonesia" },
]

export default function CekOngkir({ weight, subtotal = 0, onSelect }: Props) {
  const [query, setQuery]           = useState("")
  const [destinations, setDests]    = useState<Destination[]>([])
  const [selected, setSelected]     = useState<Destination | null>(null)
  const [showDrop, setShowDrop]     = useState(false)
  const [searching, setSearching]   = useState(false)
  const [courier, setCourier]       = useState("all")

  const [options, setOptions]       = useState<ShippingOption[]>([])
  const [picked, setPicked]         = useState<ShippingOption | null>(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState("")

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setShowDrop(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  function handleQuery(val: string) {
    setQuery(val)
    setSelected(null)
    setOptions([])
    setPicked(null)
    setError("")

    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim().length < 2) { setDests([]); setShowDrop(false); return }

    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res  = await fetch(`/api/ongkir/search?location=${encodeURIComponent(val.trim())}`)
        const json = await res.json()
        const data = json.data || []
        setDests(data)
        setShowDrop(data.length > 0)
      } catch {
        setDests([])
      } finally {
        setSearching(false)
      }
    }, 400)
  }

  function handleSelect(dest: Destination) {
    setSelected(dest)
    setQuery(dest.label)
    setShowDrop(false)
    setOptions([])
    setPicked(null)
  }

  async function handleCalculate() {
    if (!selected) return
    setLoading(true)
    setError("")
    setOptions([])
    setPicked(null)

    const couriers = courier === "all"
      ? ["jne", "jnt", "sicepat", "anteraja", "pos"]
      : [courier]

    try {
      const res  = await fetch("/api/ongkir/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination_id: selected.id, weight, couriers }),
      })
      const json = await res.json()
      const data: ShippingOption[] = json.data || []

      if (!data.length) {
        setError("Tidak ada layanan tersedia ke alamat ini.")
      } else {
        setOptions(data)
      }
    } catch {
      setError("Gagal menghitung ongkir. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  function handlePick(opt: ShippingOption) {
    setPicked(opt)
    onSelect?.(opt)
  }

  function rp(n: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR", maximumFractionDigits: 0,
    }).format(n)
  }

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 680 }}>

      {/* ── Row: destinasi + kurir + tombol ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 180px auto", gap: 8, alignItems: "flex-end" }}>

        {/* Destinasi */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5, position: "relative" }} ref={dropRef}>
          <label style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>Kota / kecamatan tujuan</label>
          <input
            type="text"
            value={query}
            placeholder="Cari kota atau kecamatan..."
            autoComplete="off"
            onChange={(e) => handleQuery(e.target.value)}
            onFocus={() => destinations.length > 0 && setShowDrop(true)}
            style={{
              padding: "9px 12px", fontSize: 13, border: "1px solid #ddd",
              borderRadius: 8, outline: "none", background: "#fafafa", width: "100%",
              boxSizing: "border-box",
            }}
          />

          {/* Tag lokasi terpilih */}
          {selected && (
            <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
              📍 {selected.district_name}, {selected.city_name}, {selected.province_name}
            </div>
          )}

          {/* Dropdown */}
          {showDrop && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
              background: "#fff", border: "1px solid #e0e0e0", borderRadius: 10,
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)", zIndex: 100,
              maxHeight: 220, overflowY: "auto",
            }}>
              {searching ? (
                <div style={{ padding: "10px 12px", fontSize: 12, color: "#aaa", textAlign: "center" }}>
                  Mencari...
                </div>
              ) : destinations.map((d) => (
                <div
                  key={d.id}
                  onMouseDown={() => handleSelect(d)}
                  style={{
                    padding: "9px 12px", cursor: "pointer", fontSize: 13,
                    borderBottom: "1px solid #f5f5f5",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9f9")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                >
                  <div style={{ fontWeight: 500 }}>{d.subdistrict_name}, {d.district_name}</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                    {d.city_name}, {d.province_name} {d.zip_code}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pilih kurir */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>Kurir</label>
          <select
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            style={{
              padding: "9px 10px", fontSize: 13, border: "1px solid #ddd",
              borderRadius: 8, outline: "none", background: "#fafafa",
              cursor: "pointer", width: "100%",
            }}
          >
            {COURIERS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Tombol */}
        <button
          disabled={!selected || loading}
          onClick={handleCalculate}
          style={{
            padding: "0 20px", height: 36, fontSize: 13, fontWeight: 600,
            background: selected && !loading ? "#111" : "#ccc",
            color: "#fff", border: "none", borderRadius: 8,
            cursor: selected && !loading ? "pointer" : "not-allowed",
            whiteSpace: "nowrap", transition: "background .15s",
          }}
        >
          {loading ? "Menghitung..." : "Cek ongkir"}
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          marginTop: 12, padding: "10px 14px", background: "#fff5f5",
          border: "1px solid #fecaca", borderRadius: 8,
          fontSize: 13, color: "#b91c1c",
        }}>
          {error}
        </div>
      )}

      {/* ── Skeleton ── */}
      {loading && (
        <div style={{ marginTop: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              height: 64, borderRadius: 10, background: "#f0f0f0",
              marginBottom: 8, animation: "pulse 1.4s infinite",
            }} />
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
        </div>
      )}

      {/* ── Hasil ongkir ── */}
      {!loading && options.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {options.map((opt, i) => (
            <div
              key={`${opt.code}-${opt.service}-${i}`}
              onClick={() => handlePick(opt)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: 12, borderRadius: 10, cursor: "pointer", marginBottom: 8,
                border: picked === opt ? "2px solid #111" : "1px solid #e0e0e0",
                background: "#fff", transition: "border-color .15s",
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 8, background: "#f5f5f5",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#555",
                textAlign: "center", flexShrink: 0, lineHeight: 1.3,
              }}>
                {opt.code.toUpperCase().slice(0, 5)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{opt.name} {opt.service}</div>
                <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                  Estimasi {opt.etd} hari
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{rp(opt.cost)}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Ringkasan ── */}
      {picked && subtotal > 0 && (
        <div style={{
          marginTop: 4, padding: "14px 16px",
          border: "1px solid #e0e0e0", borderRadius: 10, background: "#fff",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6, color: "#666" }}>
            <span>Subtotal produk</span>
            <span style={{ color: "#111", fontWeight: 500 }}>{rp(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10, color: "#666" }}>
            <span>Ongkos kirim ({picked.name} {picked.service})</span>
            <span style={{ color: "#111", fontWeight: 500 }}>{rp(picked.cost)}</span>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: 16, fontWeight: 700,
            paddingTop: 10, borderTop: "1px solid #eee",
          }}>
            <span>Total</span>
            <span>{rp(subtotal + picked.cost)}</span>
          </div>
        </div>
      )}
    </div>
  )
}