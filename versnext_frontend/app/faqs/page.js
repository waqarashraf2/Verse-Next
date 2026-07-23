import Link from "next/link";
import { ArrowRight, CheckCircle, HelpCircle, Search, Sparkles } from "lucide-react";
import { recommendedKeywordClusters, seoFaqs } from "@/lib/editorial-content";

export const metadata = {
  title: "Business Technology FAQs: AI Agents, CRM, CMS, Websites and Growth",
  description:
    "Straightforward answers to common questions about AI agents, CRM, CMS, websites, branding, and growth for business owners who want clear technology advice without fluff.",
  alternates: {
    canonical: "/faqs",
  },
  openGraph: {
    title: "Verse Next Business Technology FAQs",
    description:
      "Clear answers about AI agents, CRM, CMS, enterprise systems, websites, SEO, branding, automation, and digital growth.",
    url: "https://versenext.com/faqs",
    type: "website",
  },
};

export default function FaqsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seoFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="verse-wave-section bg-slate-50 px-4 pb-16 pt-40 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/15 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600">
              <HelpCircle size={14} />
              Business technology FAQs
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">
              FAQs about business technology
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700">
              Straightforward answers to common questions about AI agents, CRM, CMS, websites, branding, and growth.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              These FAQs assume you are a business owner looking for clear technology advice without fluff. Each answer is laser-focused on the decisions you will actually make, with helpful context and Google-friendly language.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Verse Next is known for building business websites and software. We have also created custom systems like CRM software, CMS websites, admin dashboards, ecommerce frameworks, AI agents, lead databases, mobile app backends, SEO structures, brand growth resources, and marketing automation. Think of us as a full-stack technology company with a passion for weaving design, development, content, data, and growth into one cohesive system you can use for your business.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.75fr]">
          <div className="space-y-4">
            {seoFaqs.map((faq, index) => (
              <article key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-bold text-blue-600">
                  {index + 1}
                </div>
                <h2 className="text-xl font-semibold leading-tight text-slate-950">{faq.question}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-blue-600">
              <Sparkles size={14} />
              Suggested growth topics
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">What Verse Next can build and explain</h2>
            <div className="mt-6 space-y-5">
              {recommendedKeywordClusters.map((cluster) => (
                <div key={cluster.title}>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <Search size={16} className="text-blue-600" />
                    {cluster.title}
                  </div>
                  <div className="space-y-2">
                    {cluster.keywords.map((keyword) => (
                      <div key={keyword} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                        <CheckCircle size={15} className="mt-1 shrink-0 text-blue-600" />
                        {keyword}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/contact" className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
              Plan a business system <ArrowRight className="ml-2" size={15} />
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
