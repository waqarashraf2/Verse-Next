import { pageSeo } from "@/lib/seo-content";

export const metadata = {
  title: pageSeo.portfolio.title,
  description: pageSeo.portfolio.description,
  keywords: pageSeo.portfolio.keywords,
  alternates: {
    canonical: "/portfolio/",
  },
  openGraph: {
    title: pageSeo.portfolio.title,
    description: pageSeo.portfolio.description,
    url: "https://versenext.com/portfolio/",
    type: "website",
    images: ["/icon-blue.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: pageSeo.portfolio.title,
    description: pageSeo.portfolio.description,
    images: ["/icon-blue.png"],
  },
};

export default function PortfolioLayout({ children }) {
  return children;
}
