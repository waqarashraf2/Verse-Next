export const dynamic = "force-static";

import { fallbackArticles } from "@/lib/editorial-content";

import { tools } from "@/lib/tools-content";

const routes = ["", "services", "tools", "portfolio", "articles", "faqs", "about", "contact"];
const lastModified = new Date("2026-07-23");
const withTrailingSlash = (path) => (path ? `https://versenext.com/${path}/` : "https://versenext.com/");

export default function sitemap() {
  const staticRoutes = routes.map((route) => ({
    url: withTrailingSlash(route),
    lastModified,
    changeFrequency: route === "" || route === "articles" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "articles" || route === "faqs" ? 0.9 : 0.8,
  }));

  const articleRoutes = fallbackArticles.map((article) => ({
    url: `https://versenext.com/articles/${article.slug}/`,
    lastModified,
    changeFrequency: "monthly",
    priority: article.is_featured ? 0.85 : 0.75,
  }));

  const toolRoutes = tools.map((tool) => ({
    url: `https://versenext.com/tools/${tool.slug}/`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.86,
  }));

  return [...staticRoutes, ...toolRoutes, ...articleRoutes];
}
