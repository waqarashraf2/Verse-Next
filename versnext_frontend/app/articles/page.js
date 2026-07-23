import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, CalendarDays, Search, Sparkles, Tags } from "lucide-react";
import { fallbackArticles, recommendedKeywordClusters } from "@/lib/editorial-content";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.versenext.com/api";
const hiddenLegacySlugs = new Set([
  "seo-ready-business-website-2026",
  "ai-automation-for-small-businesses",
  "technical-seo-checklist-nextjs-laravel",
]);

export const metadata = {
  title: "Technology Articles, SEO Guides and AI Automation Insights",
  description:
    "Read Verse Next articles about web development, software, SEO, digital marketing, AI automation, and practical technology decisions for growing businesses.",
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    title: "Verse Next Articles and Technology Insights",
    description:
      "Human-written technology articles for business websites, SEO, AI automation, software development, and digital growth.",
    url: "https://versenext.com/articles",
    type: "website",
  },
};

async function getArticles() {
  try {
    const response = await fetch(`${API_BASE}/articles?per_page=24`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return fallbackArticles;

    const payload = await response.json();
    const articles = payload?.data?.data || payload?.data || [];

    const visibleArticles = articles.filter((article) => !hiddenLegacySlugs.has(article.slug));

    return visibleArticles.length ? visibleArticles : fallbackArticles;
  } catch {
    return fallbackArticles;
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();
  const featured = articles.find((article) => article.is_featured) || articles[0];
  const rest = articles.filter((article) => article.slug !== featured?.slug);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Verse Next Technology Articles",
    url: "https://versenext.com/articles",
    description: metadata.description,
    mainEntity: articles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: `https://versenext.com/articles/${article.slug}`,
      author: article.author || "Verse Next Editorial Team",
      keywords: Array.isArray(article.tags) ? article.tags.join(", ") : article.tags,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

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
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[featured, ...rest].filter(Boolean).map((article) => (
            <article key={article.slug} className="verse-wave-card flex min-h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl">
              {article.featured_image ? (
                <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={article.featured_image}
                    alt={`${article.title} cover image`}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-600">{article.category || "Technology"}</span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={13} />
                  {article.reading_time || 5} min read
                </span>
              </div>
              <h2 className="text-xl font-bold leading-tight text-slate-950">{article.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{article.excerpt || article.seo_description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(Array.isArray(article.tags) ? article.tags : []).slice(0, 3).map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                    <Tags size={12} />
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/articles/${article.slug}`} className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600">
                Read guide <ArrowRight className="ml-2" size={15} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
