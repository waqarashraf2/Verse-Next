import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../Components/Navbar"
import ThemeProvider from "../Components/ThemeProvider";
import FloatingAIChat from "../Components/FloatingAIChat";
import Footer from "../Components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://versenext.com"),
  title: {
    default: "Verse Next - AI-Powered Digital Solutions Platform",
    template: "%s | Verse Next",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-blue.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon-blue.png",
  },
  manifest: "/site.webmanifest",
  applicationName: "Verse Next",
  category: "technology",
  description: "Verse Next builds enterprise-grade websites, software, mobile apps, SEO systems, digital marketing campaigns, and AI automation platforms.",
  keywords: [
    "AI digital agency",
    "enterprise web development",
    "Laravel development",
    "Next.js development",
    "SEO services",
    "mobile app development",
    "digital marketing",
    "Verse Next",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Verse Next - AI-Powered Digital Solutions Platform",
    description: "Enterprise websites, software platforms, mobile apps, SEO, marketing, and AI automation.",
    url: "https://versenext.com",
    siteName: "Verse Next",
    images: [
      {
        url: "/icon-blue.png",
        width: 512,
        height: 512,
        alt: "Verse Next",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verse Next - AI-Powered Digital Solutions Platform",
    description: "Enterprise websites, software platforms, mobile apps, SEO, marketing, and AI automation.",
    images: ["/icon-blue.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Verse Next",
    url: "https://versenext.com",
    logo: "https://versenext.com/icon-blue.png",
    description:
      "Verse Next is an AI-powered digital solutions platform for websites, software, mobile apps, SEO systems, digital marketing campaigns, and automation.",
    founder: {
      "@type": "Person",
      name: "Waqar Ashraf",
    },
    sameAs: [
      "https://www.facebook.com/share/1CtTCcqZBe/",
      "https://www.linkedin.com/company/verse-next/posts/?feedView=all",
      "https://www.tiktok.com/@verse.next?_r=1&_t=ZS-97m7D4rkex8",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@versenext.com",
      url: "https://versenext.com/contact",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Verse Next",
    url: "https://versenext.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://versenext.com/services?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[var(--bg)] text-[var(--text)]`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <FloatingAIChat />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
