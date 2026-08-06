export const siteUrl = "https://versenext.com";

export const brandLinks = [
  "https://www.facebook.com/share/1CtTCcqZBe/",
  "https://www.linkedin.com/company/verse-next/posts/?feedView=all",
  "https://www.tiktok.com/@verse.next?_r=1&_t=ZS-97m7D4rkex8",
];

export const pageSeo = {
  about: {
    title: "About Verse Next - Pakistan Software, SEO and AI Company",
    description:
      "Learn about Verse Next, a Pakistan technology company founded in 2025 to build websites, software, SEO systems, content and practical AI automation.",
    keywords: [
      "about Verse Next",
      "Pakistan software company",
      "Lahore digital agency",
      "AI automation company Pakistan",
      "web development company Pakistan",
      "SEO company Pakistan",
    ],
  },
  services: {
    title: "Digital Services - Web, SEO, Software and AI Automation",
    description:
      "Explore Verse Next services for web development, custom software, mobile apps, SEO, digital marketing, branding and AI automation.",
    keywords: [
      "web development services Pakistan",
      "software development Pakistan",
      "SEO services Pakistan",
      "AI automation services",
      "mobile app development Pakistan",
      "digital marketing agency Pakistan",
    ],
  },
  portfolio: {
    title: "Portfolio - Selected Web, App, SEO and Software Work Samples",
    description:
      "View selected Verse Next work samples, internal concepts and project-style examples for websites, apps, dashboards, SEO and digital systems.",
    keywords: [
      "Verse Next portfolio",
      "web development portfolio Pakistan",
      "software project examples",
      "digital agency portfolio",
      "mobile app portfolio",
      "business dashboard examples",
    ],
  },
  contact: {
    title: "Contact Verse Next - Website, Software, SEO and AI",
    description:
      "Contact Verse Next to discuss a website, software platform, mobile app, SEO campaign, digital marketing project or AI automation workflow.",
    keywords: [
      "contact Verse Next",
      "hire web development company Pakistan",
      "website development quote",
      "SEO services contact Pakistan",
      "AI automation consultation",
      "software development quote Pakistan",
    ],
  },
  faqs: {
    title: "Business Technology FAQs - AI, CRM, CMS and SEO",
    description:
      "Clear answers about AI agents, CRM, CMS, business websites, enterprise systems, SEO, branding, automation and digital growth from Verse Next.",
    keywords: [
      "business technology FAQs",
      "AI agents for business",
      "CRM development FAQ",
      "CMS website SEO",
      "business automation questions",
      "website SEO FAQ",
    ],
  },
};

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function webPageSchema({ name, description, path, type = "WebPage" }) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: `${siteUrl}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Verse Next",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Verse Next",
      url: siteUrl,
      logo: `${siteUrl}/icon-blue.png`,
      sameAs: brandLinks,
    },
  };
}

export function serviceListSchema(services) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Verse Next digital services",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: {
          "@type": "Organization",
          name: "Verse Next",
          url: siteUrl,
        },
        areaServed: ["Pakistan", "United States", "United Kingdom"],
      },
    })),
  };
}
