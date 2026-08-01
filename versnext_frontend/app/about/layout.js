import { pageSeo } from "@/lib/seo-content";

export const metadata = {
  title: pageSeo.about.title,
  description: pageSeo.about.description,
  keywords: pageSeo.about.keywords,
  alternates: {
    canonical: "/about/",
  },
  openGraph: {
    title: pageSeo.about.title,
    description: pageSeo.about.description,
    url: "https://versenext.com/about/",
    type: "website",
    images: ["/icon-blue.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: pageSeo.about.title,
    description: pageSeo.about.description,
    images: ["/icon-blue.png"],
  },
};

export default function AboutLayout({ children }) {
  return children;
}
