export const dynamic = "force-static";

import { fallbackArticles } from "@/lib/editorial-content";

const routes = ["", "services", "portfolio", "articles", "faqs", "about", "contact"];
const lastModified = new Date("2026-07-23");

export default function sitemap() {
  const staticRoutes = routes.map((route) => ({
    url: `https://versenext.com/${route}`,
    lastModified,
    changeFrequency: route === "" || route === "articles" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "articles" || route === "faqs" ? 0.9 : 0.8,
  }));

  const articleRoutes = fallbackArticles.map((article) => ({
    url: `https://versenext.com/articles/${article.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: article.is_featured ? 0.85 : 0.75,
  }));

  return [...staticRoutes, ...articleRoutes];
}
