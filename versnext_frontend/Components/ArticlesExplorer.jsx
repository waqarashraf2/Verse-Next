"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, CalendarDays, ChevronDown, Filter, Search, Sparkles, Tags, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_COUNT = 6;
const BATCH_SIZE = 3;

export default function ArticlesExplorer({ articles = [], featuredArticle = null }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(["All"]);
    articles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [articles]);

  // Filtered list
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" || article.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesTitle = article.title?.toLowerCase().includes(query);
      const matchesExcerpt = (article.excerpt || article.seo_description || "")
        .toLowerCase()
        .includes(query);
      const matchesTags = Array.isArray(article.tags)
        ? article.tags.some((t) => t.toLowerCase().includes(query))
        : false;

      return matchesCategory && (matchesTitle || matchesExcerpt || matchesTags);
    });
  }, [articles, selectedCategory, searchQuery]);

  const displayedArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  const hasMore = visibleCount < filteredArticles.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setVisibleCount(INITIAL_COUNT);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(INITIAL_COUNT);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setVisibleCount(INITIAL_COUNT);
  };

  return (
    <div className="w-full">
      {/* Filter and Search Controls */}
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#071633] text-white shadow-md shadow-slate-900/10"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search guides & topics..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>
          Showing <strong className="text-slate-900">{displayedArticles.length}</strong> of{" "}
          <strong className="text-slate-900">{filteredArticles.length}</strong> articles
        </span>
        {searchQuery && (
          <button
            onClick={() => {
              clearSearch();
              setSelectedCategory("All");
            }}
            className="font-semibold text-blue-600 hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Articles Grid with Staggered Fade-in */}
      {displayedArticles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-16 text-center">
          <BookOpen className="mx-auto text-slate-400" size={32} />
          <h3 className="mt-3 text-base font-semibold text-slate-800">No articles found</h3>
          <p className="mt-1 text-xs text-slate-500">
            Try adjusting your search terms or selecting another category.
          </p>
          <button
            type="button"
            onClick={() => {
              clearSearch();
              setSelectedCategory("All");
            }}
            className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {displayedArticles.map((article, index) => (
              <motion.article
                key={article.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: (index % BATCH_SIZE) * 0.08 }}
                className="group flex min-h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5"
              >
                {/* Article Image with Lazy Loading & Aspect Container */}
                {article.featured_image ? (
                  <div className="relative mb-5 aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/60">
                    <Image
                      src={article.featured_image}
                      alt={`${article.title} cover image`}
                      fill
                      sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : null}

                {/* Metadata badges */}
                <div className="mb-4 flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-500">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-600">
                    {article.category || "Technology"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <CalendarDays size={13} />
                    {article.reading_time || 5} min read
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold leading-snug text-slate-950 transition-colors group-hover:text-blue-600">
                  <Link href={`/articles/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                  {article.excerpt || article.seo_description}
                </p>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {(Array.isArray(article.tags) ? article.tags : []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200/50"
                    >
                      <Tags size={11} />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Link */}
                <Link
                  href={`/articles/${article.slug}`}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700"
                >
                  Read guide <ArrowRight className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1" size={15} />
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load More Button */}
      {hasMore ? (
        <div className="mt-14 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 active:scale-95"
          >
            <span>Load more articles</span>
            <ChevronDown size={16} />
          </button>
          <p className="mt-2 text-xs text-slate-400">
            Showing {displayedArticles.length} of {filteredArticles.length} guides
          </p>
        </div>
      ) : null}
    </div>
  );
}
