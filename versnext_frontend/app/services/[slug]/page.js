import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, MessageSquare } from "lucide-react";
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
      type: "website",
      images: ["/icon-blue.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: service.description,
      images: ["/icon-blue.png"],
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `${siteUrl}/services/${service.slug}/`,
    provider: {
      "@type": "Organization",
      name: "Verse Next",
      url: siteUrl,
    },
    areaServed: ["Pakistan", "United States", "United Kingdom"],
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

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services/" },
    { name: service.title, path: `/services/${service.slug}/` },
  ]);

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link href="/services/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#4d61b7]">
            <ArrowLeft className="h-4 w-4" />
            All services
          </Link>

          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#64748B]">Verse Next Service</p>
            <h1 className="text-4xl font-bold leading-tight text-[#071633] sm:text-5xl lg:text-6xl">{service.title}</h1>
            <p className="mt-6 text-lg leading-8 text-[#64748B]">{service.description}</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-3xl font-bold text-[#071633]">What This Service Includes</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {service.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4d61b7]" />
                  <span className="text-[#263a5c]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-[#071633]">Delivery Process</h2>
            <div className="mt-6 space-y-5">
              {service.process.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#071633] text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#071633]">{step}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#64748B]">
                      We keep this phase clear, documented, and aligned with the business goal.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-[#071633]">FAQs About {service.title}</h2>
          <div className="mt-8 space-y-4">
            {service.faqs.map(([question, answer]) => (
              <div key={question} className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-[#071633]">{question}</h3>
                <p className="mt-3 leading-7 text-[#64748B]">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl bg-[#071633] p-8 text-center text-white sm:p-12">
          <MessageSquare className="mx-auto mb-5 h-10 w-10 text-white" />
          <h2 className="text-3xl font-bold">Want to Discuss {service.title}?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Share your business goal and we will suggest a practical next step with clear scope, timeline, and cost direction.
          </p>
          <Link href="/contact/" className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-[#071633]">
            Start Conversation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
