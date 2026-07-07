export const dynamic = "force-static";

const routes = ["", "services", "portfolio", "about", "contact"];
const lastModified = new Date("2026-07-05");

export default function sitemap() {
  return routes.map((route) => ({
    url: `https://versenext.com/${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
