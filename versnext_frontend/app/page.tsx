"use client";

import type { ElementType } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle,
  Code2,
  Globe2,
  Layers3,
  Megaphone,
  Palette,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";
import heroBg from "@/assets/bg.png";

type Service = {
  title: string;
  description: string;
  icon: ElementType;
  tag: string;
};

const services: Service[] = [
  {
    title: "Website Development",
    description: "Modern business websites, ecommerce stores, landing pages, and SEO-ready content structures for Pakistan and global clients.",
    icon: Globe2,
    tag: "Web",
  },
  {
    title: "Software Development",
    description: "Web applications, business applications, dashboards, portals, SaaS products, CRMs, APIs, and internal systems.",
    icon: Code2,
    tag: "Software",
  },
  {
    title: "AI Solutions",
    description: "AI chat assistants, workflow automation, lead qualification, and smart recommendation flows.",
    icon: Brain,
    tag: "AI",
  },
  {
    title: "Mobile Apps",
    description: "Cross-platform mobile apps with clean UX, admin panels, notifications, and launch support.",
    icon: Smartphone,
    tag: "Apps",
  },
  {
    title: "SEO Services",
    description: "Technical SEO, content strategy, keyword planning, local SEO, and authority building.",
    icon: Search,
    tag: "SEO",
  },
  {
    title: "Digital Marketing",
    description: "Paid campaigns, funnels, analytics, retargeting, and creative testing for measurable growth.",
    icon: Megaphone,
    tag: "Growth",
  },
  {
    title: "Graphic Design",
    description: "Brand identity, social creatives, pitch decks, interface assets, and visual systems.",
    icon: Palette,
    tag: "Design",
  },
  {
    title: "Video Editing",
    description: "Commercial videos, reels, motion graphics, launch content, and brand storytelling.",
    icon: Video,
    tag: "Video",
  },
];

const processSteps = [
  ["01", "Discovery", "We understand your business, audience, goals, and technical needs."],
  ["02", "Strategy", "We define scope, architecture, timeline, content, and measurable outcomes."],
  ["03", "Design", "We create a polished user experience aligned with your brand."],
  ["04", "Build", "We develop clean frontend, backend, integrations, and admin systems."],
  ["05", "Launch", "We test, optimize, deploy, and support the product after launch."],
];

const stats = [
  ["250+", "Projects completed"],
  ["98%", "Client satisfaction"],
  ["24h", "Average response"],
  ["8+", "Core services"],
];

const heroFeatures: Array<[string, ElementType]> = [
  ["Secure APIs", ShieldCheck],
  ["Fast delivery", Zap],
  ["Clean UI", Layers3],
  ["Growth focus", BarChart3],
];

const seoHighlights = [
  {
    title: "Website development and application development",
    text: "Verse Next builds professional websites, web applications, business applications, ecommerce stores, dashboards, customer portals, admin panels, mobile app backends, and API-based software systems. Each project is planned for usability, performance, search visibility, lead generation, and long-term business growth.",
  },
  {
    title: "AI-powered digital solutions platform",
    text: "Verse Next brings strategy, design, frontend development, Laravel backend development, SEO optimization, digital marketing, and AI automation into one professional delivery process. This helps a business avoid scattered tools and disconnected vendors while keeping the website, software, content, and lead flow aligned.",
  },
  {
    title: "SEO-ready websites and software",
    text: "Every Verse Next website is planned with search intent, page structure, metadata, readable headings, internal links, fast loading, schema markup, sitemap coverage, robots rules, and conversion-focused content. The goal is not only a polished interface; the goal is a discoverable digital presence that can support long-term organic growth.",
  },
  {
    title: "Laravel, Next.js and secure APIs",
    text: "For business systems, dashboards, admin panels, portals, ecommerce workflows, and mobile app backends, Verse Next uses clean architecture and secure API planning. The team can build login systems, role-based access, lead management, article publishing, chatbot knowledge, and reporting flows that are practical for real business operations.",
  },
  {
    title: "Professional growth and automation",
    text: "The platform supports SEO services, digital marketing campaigns, content planning, landing pages, analytics, retargeting, AI chat assistants, workflow automation, and smart forms. Each solution is shaped around business goals, user experience, trust, performance, and measurable lead generation.",
  },
];

function SectionHeader({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/15 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600">
        <Sparkles size={14} />
        {label}
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-[34px]">{title}</h2>
      <p className="mt-3 text-[15px] leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="verse-wave-card group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-slate-950 text-white shadow-lg shadow-blue-950/10">
          <Icon size={21} />
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
          {service.tag}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-950">{service.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
      <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
        Discuss project <ArrowRight size={15} className="transition group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="verse-wave-section relative min-h-screen overflow-hidden bg-[#050816] text-white">
        <Image
          src={heroBg}
          alt="Verse Next AI-powered digital solutions platform for websites, software, SEO and automation"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,22,0.96)_0%,rgba(5,8,22,0.88)_38%,rgba(5,8,22,0.48)_72%,rgba(5,8,22,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(37,99,235,0.32),transparent_28%),linear-gradient(180deg,rgba(5,8,22,0.18),rgba(5,8,22,0.7))]" />
        <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 pb-14 pt-32 sm:px-6 lg:grid-cols-[0.94fr_0.78fr] lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[12px] font-semibold text-blue-100 shadow-sm backdrop-blur">
              <Sparkles size={13} />
              Verse Next digital solutions
            </div>
            <h1 className="text-[31px] font-semibold leading-[1.12] tracking-[-0.025em] text-white sm:text-[40px] lg:text-[48px]">
              Verse Next website development, application development and SEO growth partner.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-300">
              Verse Next builds enterprise-grade websites, web applications, business software, mobile apps, SEO systems, digital marketing campaigns, and AI automation platforms with a sharp focus on performance, trust, search visibility, and lead generation.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-400">
                Get Free Consultation <ArrowRight className="ml-2" size={15} />
              </Link>
              <Link href="/services" className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/8 px-4 py-2.5 text-[13px] font-semibold text-white backdrop-blur transition hover:bg-white/12">
                Explore Services
              </Link>
            </div>

            <div className="mt-7 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/8 p-3 shadow-sm backdrop-blur">
                  <div className="text-lg font-semibold text-white">{value}</div>
                  <div className="mt-1 text-[11px] leading-4 text-slate-300">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/12 bg-[#071023]/88 p-4 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4 text-white">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    <Bot size={19} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold">AI Project Assistant</div>
                    <div className="text-[11px] text-slate-300">Lead guidance and service matching</div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] text-emerald-200">Ready</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                <div className="mb-4 h-2 w-24 rounded-full bg-blue-400/70" />
                <div className="space-y-2">
                  {[
                    ["Website", "SEO-ready company and ecommerce websites"],
                    ["Software", "Dashboards, portals, APIs and admin systems"],
                    ["Growth", "SEO, marketing, design and video content"],
                  ].map(([title, text]) => (
                    <div key={title} className="flex items-start gap-3 rounded-lg bg-white/[0.06] p-3">
                      <CheckCircle className="mt-0.5 text-[var(--accent)]" size={15} />
                      <div>
                        <div className="text-[12px] font-semibold text-white">{title}</div>
                        <div className="text-[11px] leading-5 text-slate-300">{text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {heroFeatures.map(([label, Icon]) => {
                const TypedIcon = Icon;
                return (
                  <div key={label} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.08] p-3 text-[12px] font-semibold text-slate-100">
                    <TypedIcon size={15} className="text-blue-300" />
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="verse-wave-section bg-white px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader label="Services" title="Digital solutions with a practical business focus" text="Everything is designed to look professional, load fast, capture leads, and support long-term growth." />
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
        <div className="mx-auto mt-8 grid max-w-7xl gap-5 lg:grid-cols-3">
          {[
            ["AI Consultation", "We map the right features before development starts."],
            ["SEO Foundation", "Every website is structured for discoverability and speed."],
            ["Admin Ready", "Lead capture and content systems are designed to be managed."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="verse-wave-section bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
              Verse Next SEO foundation
            </div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-[34px]">
              AI-powered digital solutions platform built for search, speed, trust and conversions.
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-300">
              Verse Next helps companies plan, design, build, optimize, and automate their digital presence from the first website page to the backend API. The platform combines web development, software development, mobile app development, SEO services, digital marketing, design, video content, and AI automation so each project has a stronger technical and commercial foundation.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {seoHighlights.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
              <h3 className="text-base font-semibold text-white">Website development</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Business websites, ecommerce stores, landing pages, service pages, portfolio websites, and content hubs are structured with clean navigation, useful page copy, optimized headings, clear calls to action, and mobile responsive layouts.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
              <h3 className="text-base font-semibold text-white">SEO optimization</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Technical SEO work covers meta titles, meta descriptions, canonical URLs, internal links, image alt text, structured data, XML sitemap setup, robots rules, performance checks, and keyword-focused content planning.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
              <h3 className="text-base font-semibold text-white">AI automation</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                AI assistants, FAQ automation, lead routing, chatbot training data, business workflow automation, and smart recommendation flows help teams answer visitors faster while keeping every conversation professional and service-focused.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="verse-wave-section relative overflow-hidden border-y border-slate-200 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-3 inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
              AI + Consultation
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-[34px]">Turn visitor questions into qualified project conversations.</h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-600">
              The website uses an AI assistant and consultation flow to collect requirements, recommend the right service, and move serious prospects toward a discovery call.
            </p>
            <div className="mt-6 space-y-3">
              {["Floating chatbot on all pages", "Roman Urdu examples supported", "Lead capture through backend API", "Discovery-first project planning"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <CheckCircle size={17} className="text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-950 to-slate-950 p-1 shadow-2xl shadow-blue-950/10">
            <div className="rounded-[22px] border border-slate-200 bg-white p-6 text-slate-950">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <BarChart3 size={21} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">Project Discovery</h3>
                  <p className="text-sm text-slate-500">Share your goals and receive a tailored roadmap.</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {["Business goals", "Required features", "Timeline priorities", "Recommended stack"].map((item) => (
                  <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <CheckCircle className="mb-3 text-emerald-500" size={18} />
                    <div className="text-sm font-semibold text-slate-900">{item}</div>
                    <div className="mt-1 text-xs leading-5 text-slate-500">Reviewed during consultation.</div>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                Request Consultation <ArrowRight className="ml-2" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="verse-wave-section bg-white px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader label="Process" title="A clear process from idea to launch" text="No confusing handoff. We plan, design, build, test, and improve with your business goals in view." />
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-5">
          {processSteps.map(([number, title, text]) => (
            <div key={number} className="verse-wave-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-blue-500/5 blur-2xl" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-600">{number}</div>
              <h3 className="font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="verse-wave-section bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_0.8fr] md:items-center">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Consultation</div>
            <h2 className="text-2xl font-bold md:text-4xl">Need a website, app, SEO, marketing, or AI solution?</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Send your requirements and we will suggest the right scope, timeline, and next step.
            </p>
          </div>
          <div className="flex gap-3 md:justify-end">
            <Link href="/contact" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950">
              Contact Verse Next
            </Link>
            <Link href="/services" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white">
              View Services
            </Link>
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-3 border-t border-white/10 pt-6 text-sm text-slate-300">
            <a href="https://www.facebook.com/share/1CtTCcqZBe/" rel="noopener noreferrer" target="_blank" className="rounded-full border border-white/15 px-4 py-2 hover:bg-white/10">
              Share on Facebook
            </a>
            <a href="https://www.linkedin.com/company/verse-next/posts/?feedView=all" rel="noopener noreferrer" target="_blank" className="rounded-full border border-white/15 px-4 py-2 hover:bg-white/10">
              Follow on LinkedIn
            </a>
            <a href="https://www.tiktok.com/@verse.next?_r=1&_t=ZS-97m7D4rkex8" rel="noopener noreferrer" target="_blank" className="rounded-full border border-white/15 px-4 py-2 hover:bg-white/10">
              Follow on TikTok
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
