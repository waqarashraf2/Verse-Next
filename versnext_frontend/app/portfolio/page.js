"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Building2,
  CheckCircle,
  ClipboardList,
  MessageSquare,
  PanelsTopLeft,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import { breadcrumbSchema, pageSeo, siteUrl, webPageSchema } from "@/lib/seo-content";

const capabilityDemos = [
  {
    title: "Enterprise operations platform",
    description:
      "A business system concept for teams that need order tracking, staff access, dashboards, and routine reports in one place.",
    icon: PanelsTopLeft,
    stack: "Laravel + Next.js",
    features: ["Order management", "Employee roles and permissions", "Live dashboards", "Automated reports"],
  },
  {
    title: "Multi vendor ecommerce store",
    description:
      "A marketplace setup for businesses that need vendor accounts, product control, checkout, delivery flow, and customer support tools.",
    icon: ShoppingCart,
    stack: "Next.js + Laravel APIs",
    features: ["Vendor dashboards", "Product management", "Online payments", "Delivery tracking", "Reviews and support"],
  },
  {
    title: "AI social media automation",
    description:
      "A content workflow demo for teams that want to plan posts, generate ideas, prepare visuals, schedule content, and review performance.",
    icon: Bot,
    stack: "AI workflow + dashboard",
    features: ["AI assisted posts", "Image generation", "Content calendar", "Automatic publishing", "Analytics dashboard"],
  },
  {
    title: "Real estate platform",
    description:
      "A property listing system concept with search, maps, agent tools, and lead handling for real estate teams.",
    icon: Building2,
    stack: "Web app + map tools",
    features: ["Property listings", "Advanced search", "Map integration", "Agent dashboards", "Lead management"],
  },
  {
    title: "Business CRM system",
    description:
      "A CRM concept for small and growing teams that need cleaner customer records, sales follow-ups, tasks, and reporting.",
    icon: Users,
    stack: "Laravel CRM + admin panel",
    features: ["Customer management", "Sales pipeline", "Tasks and follow-ups", "Reports and notifications"],
  },
  {
    title: "Modern mobile application",
    description:
      "A mobile product concept for customer and staff apps connected with payments, notifications, and an admin backend.",
    icon: Smartphone,
    stack: "Mobile app + backend APIs",
    features: ["Customer and staff apps", "Push notifications", "Payments", "Admin panel", "Android and iOS planning"],
  },
];

const privateExperience = [
  "Business portals and operational dashboards",
  "Ecommerce workflows and vendor management",
  "Mobile application planning and backend APIs",
  "Automated workflows for leads, reports, and content",
];

const faqs = [
  {
    question: "Are these real client projects?",
    answer:
      "These are Verse Next capability demos. They are created to show the type of systems our team can design and build without making public claims about private client work.",
  },
  {
    question: "Why are client names not shown?",
    answer:
      "Some projects cannot be displayed publicly because of privacy, ownership, or confidentiality limits. We keep the public page honest and can discuss relevant experience during consultation.",
  },
  {
    question: "Can Verse Next build something similar for my business?",
    answer:
      "Yes. Each demo represents a practical direction. The final scope depends on your workflow, budget, users, integrations, content, and launch plan.",
  },
  {
    question: "Do these demos help SEO and Google understanding?",
    answer:
      "Yes. The page uses clear headings, descriptive copy, structured demo cards, internal links, and schema so search engines can understand the services and capabilities accurately.",
  },
];

export default function PortfolioPage() {
  const pageSchema = webPageSchema({
    name: pageSeo.portfolio.title,
    description: pageSeo.portfolio.description,
    path: "/portfolio/",
    type: "CollectionPage",
  });
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio/" },
  ]);
  const demosSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Verse Next solution capability demos",
    itemListElement: capabilityDemos.map((demo, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: demo.title,
        description: demo.description,
        creator: {
          "@type": "Organization",
          name: "Verse Next",
          url: siteUrl,
        },
      },
    })),
  };
  const faqSchema = {
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
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(demosSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="verse-wave-section relative overflow-hidden pt-28 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full border-2 border-[#4d61b7]" />
          <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full border-2 border-[#6f7ed1]" />
          <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-[#071633]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#6f7ed1]/10 px-4 py-2 text-sm font-medium text-[#071633]">
              <Sparkles className="h-4 w-4" />
              <span>Solutions and capabilities</span>
            </div>

            <h1 className="mb-6 text-3xl font-bold leading-tight text-[#071633] md:text-4xl lg:text-5xl">
              What We Can Build for Your Business
            </h1>

            <p className="mx-auto max-w-3xl text-lg leading-8 text-[#64748B] md:text-xl">
              From business websites to enterprise software, explore solution demos our team can design and develop around your requirements.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="verse-wave-section bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#64748B]">
              <div className="h-px w-12 bg-[#263a5c]" />
              6 CAPABILITY DEMOS
              <div className="h-px w-12 bg-[#263a5c]" />
            </div>
            <h2 className="text-3xl font-bold text-[#071633] md:text-4xl">Solution demos built for honest review</h2>
            <p className="mt-4 text-base leading-7 text-[#64748B]">
              These cards show the kind of systems Verse Next can plan, design, and build. They are not public client claims.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {capabilityDemos.map((demo, index) => {
              const Icon = demo.icon;
              return (
                <motion.article
                  key={demo.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#4d61b7] hover:shadow-xl"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4d61b7]/10 text-[#4d61b7]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="rounded-full bg-[#071633]/5 px-3 py-1 text-xs font-semibold text-[#071633]">
                      {demo.stack}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold leading-tight text-[#071633]">{demo.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#64748B]">{demo.description}</p>

                  <div className="mt-5 space-y-3">
                    {demo.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#4d61b7]" />
                        <span className="text-sm leading-6 text-[#263a5c]">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="rounded-xl border border-[#4d61b7]/20 bg-[#4d61b7]/5 p-4 text-sm leading-6 text-[#263a5c]">
                      Verse Next Capability Demo. Created to demonstrate our design and development expertise.
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="verse-wave-section bg-white py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#64748B]">
                <div className="h-px w-10 bg-[#263a5c]" />
                CONFIDENTIAL CLIENT EXPERIENCE
              </div>
              <h2 className="text-3xl font-bold leading-tight text-[#071633] md:text-4xl">
                Some work cannot be shown publicly.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#64748B]">
                Our team has experience with business portals, operational dashboards, ecommerce systems, mobile application planning, and automated workflows. Some client projects cannot be displayed because of privacy or ownership limits, but private demonstrations may be available during consultation.
              </p>
              <Link href="/contact" className="mt-6 inline-flex items-center rounded-xl bg-[#071633] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#071633]/20 transition hover:bg-[#4d61b7]">
                Request a Private Discussion
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
            >
              <h3 className="text-xl font-bold text-[#071633]">Experience areas we can discuss</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {privateExperience.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl bg-white p-4">
                    <ClipboardList className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4d61b7]" />
                    <span className="text-sm leading-6 text-[#64748B]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="verse-wave-section bg-gray-50 py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-[#071633]">Portfolio FAQs</h2>
            <div className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <article key={faq.question} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-[#071633]">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#64748B]">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="verse-wave-section bg-gradient-to-br from-[#071633] to-[#263a5c] py-16 mb-2">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <MessageSquare className="mx-auto mb-5 h-10 w-10 text-white" />
          <h2 className="text-3xl font-bold text-white md:text-4xl">Build Something Similar</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Share your idea and we will suggest a clear plan, practical scope, and transparent delivery path.
          </p>
          <Link href="/contact" className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 font-semibold text-[#071633]">
            Start Conversation
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
