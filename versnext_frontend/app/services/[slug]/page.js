import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Code2,
  FileCheck,
  HelpCircle,
  Layers,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";
import { breadcrumbSchema, siteUrl } from "@/lib/seo-content";
import { servicePages } from "@/lib/services-content";

export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);

  if (!service) {
    return {};
  }

  const title = `${service.title} Services | Verse Next`;
  const url = `${siteUrl}/services/${service.slug}/`;
  const ogImage = `${siteUrl}${service.heroImage || "/icon-blue.png"}`;

  return {
    title,
    description: service.description,
    keywords: service.keywords,
    alternates: {
      canonical: `/services/${service.slug}/`,
    },
    openGraph: {
      title,
      description: service.description,
      url,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 675,
          alt: `${service.title} - Verse Next`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: service.description,
      images: [ogImage],
    },
  };
}

/* Modern Wave SVG Components for seamless section cutouts */
function WaveTop({ fill = "#f8fafc" }) {
  return (
    <div className="w-full overflow-hidden leading-none">
      <svg
        className="relative block w-full h-10 sm:h-16 lg:h-20"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,32 C280,95 440,-10 720,40 C1000,90 1220,10 1440,35 L1440,100 L0,100 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

function WaveBottom({ fill = "#ffffff" }) {
  return (
    <div className="w-full overflow-hidden leading-none">
      <svg
        className="relative block w-full h-10 sm:h-16 lg:h-20"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 L1440,0 L1440,35 C1220,10 1000,90 720,40 C440,-10 280,95 0,32 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  // Related services
  const relatedServices = servicePages
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `${siteUrl}/services/${service.slug}/`,
    image: `${siteUrl}${service.heroImage || "/icon-blue.png"}`,
    provider: {
      "@type": "Organization",
      name: "Verse Next",
      url: siteUrl,
      logo: `${siteUrl}/icon-blue.png`,
    },
    areaServed: [
      { "@type": "Country", name: "Pakistan" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "United Arab Emirates" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} Capabilities`,
      itemListElement:
        service.capabilities?.map((cap) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: cap.title,
            description: cap.description,
          },
        })) || [],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: service.article?.heading || service.title,
    description: service.description,
    image: `${siteUrl}${service.heroImage || "/icon-blue.png"}`,
    author: {
      "@type": "Organization",
      name: "Verse Next",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Verse Next",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon-blue.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/services/${service.slug}/`,
    },
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services/" },
    { name: service.title, path: `/services/${service.slug}/` },
  ]);

  return (
    <main className="min-h-screen bg-white text-[#263a5c]">
      {/* Structured Schema Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      {/* ========== HERO SECTION (Clean White / Slate-50) ========== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 pt-28 pb-10 sm:pt-32 sm:pb-16">
        {/* Subtle decorative mesh background dots */}
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(#4d61b7_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Back Link */}
          <Link
            href="/services/"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#4d61b7] transition hover:text-[#071633]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            All Services
          </Link>

          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              {service.badge && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4d61b7]/20 bg-[#4d61b7]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#4d61b7]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {service.badge}
                </div>
              )}
              <h1 className="text-3xl font-extrabold tracking-tight text-[#071633] sm:text-4xl lg:text-5xl">
                {service.title}
              </h1>
              <p className="mt-4 text-lg font-medium leading-relaxed text-[#475569] sm:text-xl">
                {service.shortDescription}
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#64748b]">
                {service.description}
              </p>

              {/* Call to Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact/"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#4d61b7] to-[#3a4ba0] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4d61b7]/25 transition hover:brightness-110 hover:scale-[1.02]"
                >
                  Request a Proposal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <a
                  href="#deep-dive"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-[#071633] shadow-sm transition hover:border-[#4d61b7] hover:bg-slate-50"
                >
                  Explore Breakdown
                </a>
              </div>

              {/* Tech Stack Pills */}
              {service.techStack && (
                <div className="mt-8 border-t border-slate-200/80 pt-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#64748b]">
                    Core Frameworks & Tools
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-[#071633] shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Generated Visual Preview */}
            <div className="lg:col-span-5">
              <div className="verse-wave-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl transition-all duration-500 hover:shadow-2xl">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={service.heroImage || "/icon-blue.png"}
                    alt={`${service.title} - Verse Next`}
                    fill
                    sizes="(max-width: 768px) 100vw, 520px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    priority
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs font-medium text-[#64748b]">
                    Engineered for high performance, search intent, and business conversion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WAVE TRANSITION: Top Hero to Deep Dive Section ========== */}
      <div className="relative -mt-1 z-10">
        <WaveTop fill="#f8fafc" />
      </div>

      {/* ========== IN-DEPTH ARTICLE / STRATEGY GUIDE (Slate-50) ========== */}
      {service.article && (
        <section id="deep-dive" className="bg-slate-50 px-4 pt-8 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#4d61b7]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#4d61b7]">
                <Layers className="h-3.5 w-3.5" />
                Strategic Insight & Practical Guide
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#071633] sm:text-3xl lg:text-4xl">
                {service.article.heading}
              </h2>
              {service.article.subheading && (
                <p className="mt-3 text-base font-semibold text-[#475569] sm:text-lg">
                  {service.article.subheading}
                </p>
              )}
            </div>

            <div className="space-y-6 text-base leading-relaxed text-[#475569]">
              {service.article.paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {service.article.keyTakeaways && (
              <div className="verse-wave-card mt-10 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md sm:p-8">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#071633]">
                  <Zap className="h-5 w-5 text-[#4d61b7]" />
                  Core Strategic Advantages
                </h3>
                <ul className="mt-5 grid gap-3.5 sm:grid-cols-2">
                  {service.article.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm font-medium text-[#334155]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#4d61b7]" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========== WAVE TRANSITION: Deep Dive to Capabilities Section ========== */}
      <div className="relative -mt-1 z-10">
        <WaveBottom fill="#ffffff" />
      </div>

      {/* ========== CAPABILITIES GRID (White) ========== */}
      <section className="bg-white px-4 pt-6 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4d61b7]">
              <div className="h-px w-8 bg-[#4d61b7]" />
              End-to-End Capabilities
              <div className="h-px w-8 bg-[#4d61b7]" />
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#071633] sm:text-4xl">
              What We Deliver For {service.title}
            </h2>
            <p className="mt-3 text-base text-[#64748b]">
              Every capability is executed with clean modular engineering, transparent communication, and measurable business impact.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.capabilities?.map((item, index) => (
              <div
                key={item.title || index}
                className="verse-wave-card group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#4d61b7] hover:shadow-xl"
              >
                <div>
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#4d61b7]/10 text-[#4d61b7] transition-colors group-hover:bg-[#4d61b7] group-hover:text-white">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#071633] group-hover:text-[#4d61b7]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#64748b]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WAVE TRANSITION: Capabilities to Process Section ========== */}
      <div className="relative -mt-1 z-10">
        <WaveTop fill="#f8fafc" />
      </div>

      {/* ========== 5-PHASE ROADMAP SECTION (Slate-50) ========== */}
      <section className="bg-slate-50 px-4 pt-8 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4d61b7]">
              <div className="h-px w-8 bg-[#4d61b7]" />
              Predictable Roadmap
              <div className="h-px w-8 bg-[#4d61b7]" />
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#071633] sm:text-4xl">
              Our 5-Phase Execution Model
            </h2>
            <p className="mt-3 text-base text-[#64748b]">
              No black boxes or surprise delays. Here is the transparent roadmap we follow from initial scope to live release.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-5">
            {service.process?.map((phase, idx) => (
              <div
                key={phase.step || idx}
                className="verse-wave-card relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#071633] text-xs font-bold text-white">
                      {phase.step || `0${idx + 1}`}
                    </span>
                    {phase.timeline && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748b]">
                        <Clock className="h-3 w-3 text-[#4d61b7]" />
                        {phase.timeline}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#071633]">
                    {phase.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#64748b]">
                    {phase.description}
                  </p>
                </div>
                {phase.deliverables && (
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                      Deliverable:
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-[#4d61b7]">
                      {phase.deliverables}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WAVE TRANSITION: Process to Deliverables Section ========== */}
      <div className="relative -mt-1 z-10">
        <WaveBottom fill="#ffffff" />
      </div>

      {/* ========== TANGIBLE DELIVERABLES CHECKLIST (White) ========== */}
      {service.deliverables && (
        <section className="bg-white px-4 pt-6 pb-20 sm:px-6 lg:px-8">
          <div className="verse-wave-card mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/80 p-8 shadow-lg sm:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4d61b7]/10 text-[#4d61b7]">
                <FileCheck className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#071633]">
                What You Receive (Tangible Deliverables)
              </h2>
            </div>
            <p className="mt-3 text-sm text-[#64748b]">
              Upon completion of the project, you receive 100% intellectual property ownership and complete access to all project assets:
            </p>
            <div className="mt-6 space-y-3">
              {service.deliverables.map((deliv, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm font-semibold text-[#334155]">{deliv}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== WAVE TRANSITION: Deliverables to FAQ Section ========== */}
      <div className="relative -mt-1 z-10">
        <WaveTop fill="#f8fafc" />
      </div>

      {/* ========== FAQS SECTION (Slate-50) ========== */}
      <section className="bg-slate-50 px-4 pt-8 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4d61b7]">
              <HelpCircle className="h-4 w-4" />
              Frequently Asked Questions
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#071633] sm:text-4xl">
              Common Questions About {service.title}
            </h2>
            <p className="mt-3 text-base text-[#64748b]">
              Clear answers to questions about timelines, technology choices, ownership, and ongoing maintenance.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {service.faqs?.map(([question, answer], idx) => (
              <div
                key={question || idx}
                className="verse-wave-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#4d61b7]/40 hover:shadow-md"
              >
                <h3 className="text-base font-bold text-[#071633] sm:text-lg">
                  {question}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#64748b] sm:text-base">
                  {answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WAVE TRANSITION: FAQs to Related Services ========== */}
      <div className="relative -mt-1 z-10">
        <WaveBottom fill="#ffffff" />
      </div>

      {/* ========== EXPLORE ADJACENT SERVICES (White) ========== */}
      {relatedServices.length > 0 && (
        <section className="bg-white px-4 pt-6 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#4d61b7]">
                  Explore Adjacent Services
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#071633] sm:text-3xl">
                  Complementary Solutions
                </h2>
              </div>
              <Link
                href="/services/"
                className="inline-flex items-center gap-1 text-sm font-bold text-[#4d61b7] hover:underline"
              >
                View all 13 services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {relatedServices.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/services/${rel.slug}/`}
                  className="verse-wave-card group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#4d61b7] hover:shadow-xl"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#071633] group-hover:text-[#4d61b7]">
                      {rel.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#64748b]">
                      {rel.shortDescription}
                    </p>
                  </div>
                  <div className="mt-5 inline-flex items-center text-xs font-bold text-[#4d61b7] group-hover:translate-x-1 transition-transform">
                    Learn more
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== CONVERSION CONTACT BANNER (Verse Next Dark Navy Branded Banner) ========== */}
      <section className="px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="verse-wave-section relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#071633] via-[#0d2250] to-[#071633] p-8 text-center text-white shadow-2xl sm:p-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to Discuss Your {service.title}?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Share your project requirements and goals with us. We will provide a detailed scope analysis, technical roadmap, and transparent quote within 24 hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-bold text-[#071633] shadow-lg transition hover:bg-slate-100 hover:scale-105"
            >
              Start Conversation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/portfolio/"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
