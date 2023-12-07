import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://somin-blog.vercel.app/sitemap.xml",
    host: "https://somin-blog.vercel.app",
  };
}
