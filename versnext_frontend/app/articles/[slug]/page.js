import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Tags } from "lucide-react";
import { articleToText, fallbackArticles } from "@/lib/editorial-content";
import ShareButtons from "@/Components/ShareButtons";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.versenext.com/api";
const hiddenLegacySlugs = new Set([
  "seo-ready-business-website-2026",
  "ai-automation-for-small-businesses",
  "technical-seo-checklist-nextjs-laravel",
]);
const legacySlugParams = Array.from(hiddenLegacySlugs).map((slug) => ({ slug }));

function mergeArticles(primaryArticles, fallbackItems) {
  const bySlug = new Map();

  fallbackItems.forEach((article) => bySlug.set(article.slug, article));
  primaryArticles.forEach((article) => bySlug.set(article.slug, article));

  return Array.from(bySlug.values()).filter((article) => !hiddenLegacySlugs.has(article.slug));
}

async function fetchArticles() {
  try {
    const response = await fetch(`${API_BASE}/articles?per_page=100`, {
      next: { revalidate: 10 },
    });

    if (!response.ok) return fallbackArticles;

    const payload = await response.json();
    const articles = payload?.data?.data || payload?.data || [];

    return mergeArticles(articles, fallbackArticles);
  } catch {
    return fallbackArticles;
  }
}

async function fetchArticle(slug) {
  if (hiddenLegacySlugs.has(slug)) return fallbackArticles[0];

  try {
    const response = await fetch(`${API_BASE}/articles/${slug}`, {
      next: { revalidate: 10 },
    });

    if (response.ok) {
      const payload = await response.json();
      if (payload?.data) return payload.data;
    }
  } catch {
    // Use local fallback below.
  }

  return fallbackArticles.find((article) => article.slug === slug) || null;
}

export async function generateStaticParams() {
  const articles = await fetchArticles();

  const articleParams = articles.map((article) => ({
    slug: article.slug,
  }));

  return [...articleParams, ...legacySlugParams];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: true },
    };
  }

  const baseTitle = (article.seo_title || article.title).replace(/\s*\|\s*Verse\s*Next/gi, "");
  const cleanDescription = (article.seo_description || article.excerpt || "").slice(0, 150);

  return {
    title: baseTitle,
    description: cleanDescription,
    alternates: {
      canonical: `/articles/${article.slug}/`,
    },
    openGraph: {
      title: baseTitle,
      description: cleanDescription,
      url: `https://versenext.com/articles/${article.slug}/`,
      type: "article",
      publishedTime: article.published_at,
      authors: [article.author || "Verse Next Editorial Team"],
      tags: Array.isArray(article.tags) ? article.tags : [],
      images: article.featured_image
        ? [
            {
              url: article.featured_image,
              width: 1400,
              height: 788,
              alt: `${article.title} cover image`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description: cleanDescription,
      images: article.featured_image ? [`https://versenext.com${article.featured_image}`] : undefined,
    },
  };
}

function normalizeContent(article) {
  if (Array.isArray(article.content)) return article.content;

  const fallbackArticle = fallbackArticles.find((item) => item.slug === article.slug);
  const paragraphs = String(article.content || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (fallbackArticle && paragraphs.length > 1) {
    return paragraphs.map((body, index) => ({
      heading: fallbackArticle.content[index]?.heading || null,
      body,
    }));
  }

  return paragraphs.map((body, index) => ({
      heading: index === 0 ? "Overview" : null,
      body,
    }));
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) notFound();

  const sections = normalizeContent(article);
  const publishedDate = article.published_at ? new Date(article.published_at) : null;
  const tags = Array.isArray(article.tags) ? article.tags : [];
  const fallbackArticle = fallbackArticles.find((item) => item.slug === article.slug);
  const internalLinks = article.internal_links || article.internalLinks || fallbackArticle?.internalLinks || [];
  const faqs = article.faqs || fallbackArticle?.faqs || [];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.seo_description || article.excerpt,
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      "@type": "Organization",
      name: article.author || "Verse Next Editorial Team",
      url: "https://versenext.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Verse Next",
      logo: {
        "@type": "ImageObject",
        url: "https://versenext.com/icon-blue.png",
      },
    },
    mainEntityOfPage: `https://versenext.com/articles/${article.slug}/`,
    articleSection: article.category,
    keywords: tags.join(", "),
    wordCount: articleToText(article).split(/\s+/).filter(Boolean).length,
    image: article.featured_image ? `https://versenext.com${article.featured_image}` : "https://versenext.com/icon-blue.png",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://versenext.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: "https://versenext.com/articles/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://versenext.com/articles/${article.slug}/`,
      },
    ],
  };

  const faqSchema = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <article className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}

      <section className="verse-wave-section bg-slate-50 px-4 pb-14 pt-40 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/articles" className="mb-8 inline-flex items-center text-sm font-semibold text-blue-600">
            <ArrowLeft className="mr-2" size={16} />
            Back to articles
          </Link>

          <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-blue-600">{article.category || "Technology"}</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={14} />
              {article.reading_time || 5} min read
            </span>
            {publishedDate ? (
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={14} />
                {publishedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            ) : null}
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">{article.title}</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">{article.excerpt || article.seo_description}</p>

          {article.featured_image ? (
            <div className="relative mt-9 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-xl shadow-slate-950/10">
              <Image
                src={article.featured_image}
                alt={`${article.title} cover image`}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : null}

          <div className="mt-7 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                <Tags size={13} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-10 text-slate-700">
            {sections.map((section, index) => (
              <section key={`${section.heading || "section"}-${index}`}>
                {section.heading ? <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{section.heading}</h2> : null}
                <div className="mt-4 text-[16px] leading-8 space-y-4" dangerouslySetInnerHTML={{ __html: section.body }} />
              </section>
            ))}
          </div>

          {faqs.length ? (
            <section className="mt-14">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Frequently asked questions</h2>
              <div className="mt-6 space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-lg font-semibold text-slate-950">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Social Sharing Section */}
          <ShareButtons slug={article.slug} title={article.title} />

          <div className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-950">Need this for your business?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Verse Next can plan the strategy, content structure, SEO foundation, and technical implementation for your website, software platform, or AI automation workflow.
            </p>
            {internalLinks.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {internalLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
            <Link href="/contact" className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
              Request consultation
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
