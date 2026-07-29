import Link from "next/link";
import { ArrowRight, FileText, Image as ImageIcon, Layers, Search, ShieldCheck, Sparkles } from "lucide-react";
import { toolIndex, tools } from "@/lib/tools-content";

export const metadata = {
  title: "Free Online PDF Tools for Image to PDF, JPG to PDF, Merge, Compress and Split",
  description: toolIndex.description,
  keywords: toolIndex.keywords,
  alternates: {
    canonical: "/tools/",
  },
  openGraph: {
    title: "Free Online PDF Tools by Verse Next",
    description: toolIndex.description,
    url: "https://versenext.com/tools/",
    type: "website",
  },
};

export default function ToolsPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: toolIndex.title,
    url: "https://versenext.com/tools/",
    description: toolIndex.description,
    mainEntity: tools.map((tool) => ({
      "@type": "WebApplication",
      name: tool.title,
      url: `https://versenext.com/tools/${tool.slug}/`,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      description: tool.description,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="verse-wave-section bg-slate-50 px-4 pb-16 pt-40 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/15 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600">
              <Sparkles size={14} />
              Free PDF tools in your browser
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-6xl">
              Convert, merge, compress and split PDF files online.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Verse Next Tools help with common document jobs: convert multiple images into a single PDF, turn JPG files into one PDF, merge PDF files, reduce PDF size and split PDF pages without installing heavy software.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Browser privacy", text: "Your files are processed in your browser while the tool creates the PDF." },
              { icon: Layers, title: "Multiple images", text: "The Image to PDF and JPG to PDF tools can place several pictures into one PDF." },
              { icon: Search, title: "Clear guidance", text: "Each page explains what the tool does, when to use it and the common questions people ask." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <Icon className="mb-4 text-[#4d61b7]" size={28} />
                  <h2 className="text-lg font-bold text-[#071633]">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="verse-wave-section bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 max-w-3xl">
            <h2 className="text-3xl font-bold text-[#071633] md:text-4xl">Choose a PDF tool</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Each page has the tool, a plain article, practical steps, useful keywords and FAQs written around real user searches.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const isImageTool = tool.mode === "images-to-pdf";
              const Icon = isImageTool ? ImageIcon : FileText;
              return (
                <article key={tool.slug} className="verse-wave-card flex min-h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#4d61b7]/10 text-[#4d61b7]">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#071633]">{tool.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{tool.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tool.keywords.slice(0, 4).map((keyword) => (
                      <span key={keyword} className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <Link href={`/tools/${tool.slug}`} className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600">
                    Open tool <ArrowRight className="ml-2" size={15} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
