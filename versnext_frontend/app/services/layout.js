import { pageSeo } from "@/lib/seo-content";

export const metadata = {
  title: pageSeo.services.title,
  description: pageSeo.services.description,
  keywords: pageSeo.services.keywords,
  alternates: {
    canonical: "/services/",
  },
  openGraph: {
    title: pageSeo.services.title,
    description: pageSeo.services.description,
    url: "https://versenext.com/services/",
    type: "website",
    images: ["/icon-blue.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: pageSeo.services.title,
    description: pageSeo.services.description,
    images: ["/icon-blue.png"],
  },
};

export default function ServicesLayout({ children }) {
  return children;
}
