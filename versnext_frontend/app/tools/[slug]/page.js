import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle, HelpCircle, ListChecks, Search, ShieldCheck, Sparkles } from "lucide-react";
import PdfToolClient from "@/Components/PdfToolClient";
import { getToolBySlug, tools } from "@/lib/tools-content";
import { breadcrumbSchema } from "@/lib/seo-content";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  const seoTitle = `${tool.title} Online Free by Verse Next`;

  return {
    title: seoTitle,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: `/tools/${tool.slug}/`,
    },
    openGraph: {
      title: seoTitle,
      description: tool.description,
      url: `https://versenext.com/tools/${tool.slug}/`,
      type: "article",
      images: ["/icon-blue.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: tool.description,
      images: ["/icon-blue.png"],
    },
  };
}

export default async function ToolDetailPage({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const toolUrl = `https://versenext.com/tools/${tool.slug}/`;
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: toolUrl,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web Browser",
    description: tool.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${tool.title}: ${tool.article.heading}`,
    description: tool.description,
    author: {
      "@type": "Organization",
      name: "Verse Next",
    },
    publisher: {
      "@type": "Organization",
      name: "Verse Next",
      logo: {
        "@type": "ImageObject",
        url: "https://versenext.com/icon-blue.png",
      },
    },
    mainEntityOfPage: toolUrl,
    image: "https://versenext.com/icon-blue.png",
  };
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: tool.title, path: `/tools/${tool.slug}/` },
  ]);

  const relatedTools = tools.filter((item) => item.slug !== tool.slug);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="verse-wave-section bg-slate-50 px-4 pb-14 pt-40 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/15 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600">
              <Sparkles size={14} />
              Free PDF tool
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">{tool.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">{tool.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {tool.keywords.slice(0, 6).map((keyword) => (
                <span key={keyword} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <PdfToolClient tool={tool} />
        </div>
      </section>

      <section className="verse-wave-section bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_0.28fr]">
          <article className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4d61b7]">
              <Search size={16} />
              Practical guide
            </div>
            <h2 className="text-3xl font-bold leading-tight text-[#071633] md:text-4xl">{tool.article.heading}</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
              {tool.article.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="mb-4 flex items-center gap-2 text-lg font-bold text-[#071633]">
                  <ListChecks className="text-[#4d61b7]" size={22} />
                  How to use this tool
                </div>
                <ol className="space-y-3">
                  {tool.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm leading-6 text-slate-600">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#071633] text-xs font-bold text-white">{index + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-lg font-bold text-[#071633]">
                  <ShieldCheck className="text-[#4d61b7]" size={22} />
                  Why people use it
                </div>
                <ul className="space-y-3">
                  {tool.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3 text-sm leading-6 text-slate-600">
                      <CheckCircle className="mt-0.5 flex-shrink-0 text-[#4d61b7]" size={17} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="mt-12">
              <div className="mb-6 flex items-center gap-2">
                <HelpCircle className="text-[#4d61b7]" size={24} />
                <h2 className="text-3xl font-bold text-[#071633]">FAQs</h2>
              </div>
              <div className="space-y-4">
                {tool.faqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-lg font-bold text-[#071633]">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-[#071633]">Related tools</h2>
              <div className="mt-4 space-y-3">
                {relatedTools.map((item) => (
                  <Link key={item.slug} href={`/tools/${item.slug}`} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:text-[#4d61b7]">
                    {item.shortTitle}
                    <ArrowRight size={15} />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
