import { pageSeo } from "@/lib/seo-content";

export const metadata = {
  title: pageSeo.contact.title,
  description: pageSeo.contact.description,
  keywords: pageSeo.contact.keywords,
  alternates: {
    canonical: "/contact/",
  },
  openGraph: {
    title: pageSeo.contact.title,
    description: pageSeo.contact.description,
    url: "https://versenext.com/contact/",
    type: "website",
    images: ["/icon-blue.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: pageSeo.contact.title,
    description: pageSeo.contact.description,
    images: ["/icon-blue.png"],
  },
};

export default function ContactLayout({ children }) {
  return children;
}
