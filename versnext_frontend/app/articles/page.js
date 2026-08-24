import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react";
import { fallbackArticles, recommendedKeywordClusters } from "@/lib/editorial-content";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo-content";
import ArticlesExplorer from "@/Components/ArticlesExplorer";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.versenext.com/api";
const hiddenLegacySlugs = new Set([
  "seo-ready-business-website-2026",
  "ai-automation-for-small-businesses",
  "technical-seo-checklist-nextjs-laravel",
]);

function mergeArticles(primaryArticles, fallbackItems) {
  const bySlug = new Map();

  fallbackItems.forEach((article) => bySlug.set(article.slug, article));
  primaryArticles.forEach((article) => bySlug.set(article.slug, article));

  return Array.from(bySlug.values()).filter((article) => !hiddenLegacySlugs.has(article.slug));
}

export const metadata = {
  title: "Technology Articles, SEO Guides and AI Automation Insights",
  description:
    "Read Verse Next articles about web development, software, SEO, digital marketing, AI automation, and practical technology decisions for growing businesses.",
  alternates: {
    canonical: "/articles/",
  },
  openGraph: {
    title: "Verse Next Articles and Technology Insights",
    description:
      "Human-written technology articles for business websites, SEO, AI automation, software development, and digital growth.",
    url: "https://versenext.com/articles/",
    type: "website",
    images: ["/icon-blue.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verse Next Articles and Technology Insights",
    description:
      "Human-written technology articles for business websites, SEO, AI automation, software development, and digital growth.",
    images: ["/icon-blue.png"],
  },
};

async function getArticles() {
  try {
    const response = await fetch(`${API_BASE}/articles?per_page=24`, {
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

export default async function ArticlesPage() {
  const articles = await getArticles();
  const featured = articles.find((article) => article.is_featured) || articles[0];
  const allArticles = [featured, ...articles.filter((article) => article.slug !== featured?.slug)].filter(Boolean);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Verse Next Technology Articles",
    url: "https://versenext.com/articles/",
    description: metadata.description,
    mainEntity: articles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: `https://versenext.com/articles/${article.slug}/`,
      author: article.author || "Verse Next Editorial Team",
      keywords: Array.isArray(article.tags) ? article.tags.join(", ") : article.tags,
    })),
  };
  const pageSchema = webPageSchema({
    name: "Verse Next Technology Articles",
    description: metadata.description,
    path: "/articles/",
    type: "CollectionPage",
  });
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Articles", path: "/articles/" },
  ]);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="verse-wave-section bg-slate-50 px-4 pb-16 pt-40 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/15 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600">
              <Sparkles size={14} />
              Technology insights
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">
              Practical articles on websites, SEO, software and AI automation.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Humanized guides for business owners who want clearer technology decisions, better search visibility, and digital systems that can grow without becoming messy.
            </p>
          </div>

          {featured ? (
            <article className="mt-12 grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-950/5 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="bg-[#071633] p-7 text-white sm:p-9">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
                  <BookOpen size={14} />
                  Featured article
                </div>
                <h2 className="text-2xl font-semibold leading-tight sm:text-4xl">{featured.title}</h2>
                <p className="mt-5 text-sm leading-7 text-slate-300">{featured.excerpt || featured.seo_description}</p>
                <Link href={`/articles/${featured.slug}`} className="mt-7 inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#071633]">
                  Read article <ArrowRight className="ml-2" size={16} />
                </Link>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                {featured.featured_image ? (
                  <div className="relative min-h-64 overflow-hidden rounded-xl border border-slate-200 bg-slate-950 sm:col-span-2">
                    <Image
                      src={featured.featured_image}
                      alt={`${featured.title} article cover`}
                      fill
                      sizes="(min-width: 1024px) 760px, 100vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : null}
                {recommendedKeywordClusters.map((cluster) => (
                  <div key={cluster.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
                      <Search size={16} className="text-blue-600" />
                      {cluster.title}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cluster.keywords.slice(0, 4).map((keyword) => (
                        <span key={keyword} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ) : null}
        </div>
      </section>

      <section className="verse-wave-section bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ArticlesExplorer articles={allArticles} featuredArticle={featured} />
        </div>
      </section>
    </div>
  );
}

