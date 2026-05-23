// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/*", "/admin/*", "/dashboard/*"]
    },
    sitemap: "https://www.bandarmusikjakarta.com/sitemap.xml",
  };
}