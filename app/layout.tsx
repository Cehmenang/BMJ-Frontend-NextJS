import type { Metadata } from "next";
import "./globals.css";
import LayoutNav from "@/components/navbar/LayoutNav";
import QuickAction from "@/components/quick/QuickAction";
import LayoutFooter from "@/components/footer/LayoutFooter";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicStore",
  "name": "Bandar Musik Jakarta",
  "url": "https://www.bandarmusikjakarta.com",
  "telephone": "+6281929290560",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jl. Rajawali Selatan I No.26A, RT.3/RW.2, Gerbang Hitam, Kecamatan Sawah Besar, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta",
    "addressLocality": "Jakarta Pusat",
    "addressCountry": "ID",
    "postalCode": "10720"
  },
  "openingHours": "Mo-Sa 10:00-20:00",
  "priceRange": "$$",
  "image": "https://www.bandarmusikjakarta.com/meta/BMJOG.webp",
  "logo": "https://www.bandarmusikjakarta.com/meta/BMJOGSquare.webp",
  "sameAs": [
    "https://www.instagram.com/bandarmusikjakarta_bmj",
    "https://wa.me/6281929290560"
  ],
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -6.146694, 
    "longitude": 106.837833
  }
}

export const metadata: Metadata = {
 
  title: {
    default: "Bandar Musik Jakarta - Toko Alat Musik & Audio Terlengkap di Jakarta",
    template: "%s | Bandar Musik Jakarta",
  },
  description:
    "Toko alat musik terlengkap di Jakarta Pusat. Produk 100% Original, Harga Bagus, bisa nego. Belanja di toko atau online. Whatsapp: 081929290560.",
  keywords: [
    "toko musik jakarta",
    "toko alat musik jakarta pusat",
    "bandar musik jakarta",
    "bmj musik",
    "beli gitar jakarta",
    "toko drum jakarta",
    "keyboard jakarta",
    "alat musik original jakarta",
    "authorized dealer alat musik",
    "toko musik rajawali jakarta",
    "toko musik terpercaya",
    "beli audio",
    "sound system jakarta"
  ],
  authors: [{ name: "Bandar Musik Jakarta", url: "https://www.bandarmusikjakarta.com" }],
  creator: "Bandar Musik Jakarta",
  publisher: "Bandar Musik Jakarta",

  alternates: {
    canonical: "https://www.bandarmusikjakarta.com",
    languages: {
      "id-ID": "https://www.bandarmusikjakarta.com",
    },
  },

  openGraph: {
    title: "Bandar Musik Jakarta - Toko Alat Musik & Audio Terlengkap di Jakarta",
    description:
      "Toko alat musik terlengkap di Jakarta Pusat. Produk 100% Original, harga kompetitif, bisa nego. Belanja di toko atau online.",
    url: "https://www.bandarmusikjakarta.com",
    siteName: "Bandar Musik Jakarta",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/meta/BMJOG.webp", // 1200x630px
        width: 1200,
        height: 630,
        alt: "Bandar Musik Jakarta - Toko Alat Musik Terlengkap di Jakarta Pusat",
      },
      {
        url: "/meta/BMJOGSquare.webp", // 600x600px (untuk FB)
        width: 600,
        height: 600,
        alt: "Bandar Musik Jakarta",
      },
    ],
  },


  twitter: {
    card: "summary_large_image",
    title: "Bandar Musik Jakarta - Toko Alat Musik Terlengkap",
    description:
      "Toko alat musik terlengkap di Jakarta Pusat. Produk 100% Original, harga kompetitif.",
    images: ["/meta/BMJOG.webp"],
    creator: "@bandarmusikjakarta_bmj",
    site: "@bandarmusikjakarta_bmj",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/meta/BMJOGSquare.webp" },
      { url: "/meta/BMJOGSquare.webp", sizes: "16x16", type: "image/webp" },
      { url: "/meta/BMJOGSquare.webp", sizes: "32x32", type: "image/webp" },
    ],
    apple: [
      { url: "/meta/BMJFavSafari.svg", sizes: "180x180", type: "image/svg" },
    ],
    other: [
      { rel: "mask-icon", url: "/meta/BMJFavSafari.svg", color: "#1a1a1a" },
    ],
  },
  manifest: "/site.webmanifest",

  category: "music store",
  applicationName: "Bandar Musik Jakarta",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL("https://www.bandarmusikjakarta.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
          <link rel="dns-prefetch" href="https://server.bandarmusikjakarta.com" />
          <link rel="preconnect" href="https://server.bandarmusikjakarta.com" crossOrigin={'anonymous'} />
          <script defer src="https://analytics.bandarmusikjakarta.com/script.js" data-website-id="9b499a3d-a083-4aa8-8dbd-1a894483150c"></script>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      </head>


      <body className={"font-poppins antialiased"}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicStore",
              name: "Bandar Musik Jakarta",
              alternateName: "BMJ",
              url: "https://www.bandarmusikjakarta.com",
              logo: "https://www.bandarmusikjakarta.com/meta/BMJOGSquare.webp",
              image: "https://www.bandarmusikjakarta.com/meta/BMJOG.webp",
              description: "Toko alat musik terlengkap di Jakarta Pusat. Produk 100% Original, harga kompetitif, bisa nego.",
              telephone: "+62081929290560",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Jl. Rajawali Selatan I No.26A, RT.3/RW.2",
                addressLocality: "Jakarta Pusat",
                addressRegion: "DKI Jakarta",
                postalCode: "10720",
                addressCountry: "ID",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -6.1467131,
                longitude: 106.837832,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "10:00",
                  closes: "19:30",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Saturday"],
                  opens: "10:00",
                  closes: "18:00",
                },
              ],
              sameAs: [
                "https://www.tokopedia.com/bandarmusikjakarta",
                "https://www.instagram.com/bandarmusikjakarta_bmj",
                "https://www.youtube.com/@bandarmusikjakarta_bmj",
                "https://www.tiktok.com/@bandarmusikjakarta_bmj",
              ],
              priceRange: "$$",
              paymentAccepted: "Cash, Credit Card, Debit Card, Transfer",
              currenciesAccepted: "IDR",
            }),
          }}
        />
        <LayoutNav/>
        <div className="wrap">
          {children}
        </div>
        <QuickAction/>
        <LayoutFooter/>
      </body>
    </html>
  );
}
