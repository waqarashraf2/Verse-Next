"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Edit3,
  FileText,
  Inbox,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  User,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.versenext.com/api";

const emptyCollections = {
  dashboard: null,
  inquiries: [],
  consultations: [],
  leads: [],
  articles: [],
};

const emptyArticleForm = {
  id: null,
  title: "",
  slug: "",
  category: "SEO",
  seo_title: "",
  seo_description: "",
  author: "Verse Next Editorial Team",
  reading_time: 5,
  tags: "",
  content: "",
  status: "draft",
  is_featured: false,
  published_at: "",
  faqs: [],
  internal_links: [],
};

function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="verse-wave-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef1ff] text-[#4d61b7]">
        <Icon size={21} />
      </div>
      <div className="text-3xl font-bold text-[#071633]">{value ?? 0}</div>
      <div className="mt-1 text-sm font-medium text-slate-500">{label}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(emptyCollections);
  const [activePanel, setActivePanel] = useState("dashboard");
  const [articleForm, setArticleForm] = useState(emptyArticleForm);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkHref, setLinkHref] = useState("");
  const [editorTab, setEditorTab] = useState("code"); // 'code' | 'preview'
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [customLinkUrl, setCustomLinkUrl] = useState("");
  const [customLinkText, setCustomLinkText] = useState("");
  const [isExternalLink, setIsExternalLink] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const insertAtCursor = (beforeVal, afterVal = "") => {
    const textarea = document.getElementById("articleContentTextarea");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = beforeVal + (selected || "") + afterVal;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setArticleForm((current) => ({ ...current, content: newContent }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + beforeVal.length,
        start + beforeVal.length + (selected ? selected.length : 0)
      );
    }, 50);
  };

  const handleOpenLinkModal = () => {
    const textarea = document.getElementById("articleContentTextarea");
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end);
      setCustomLinkText(selected || "");
    }
    setCustomLinkUrl("");
    setIsExternalLink(false);
    setShowLinkModal(true);
  };

  const handleApplyLink = (e) => {
    e?.preventDefault();
    if (!customLinkUrl.trim()) return;
    const textToUse = customLinkText.trim() || customLinkUrl.trim();
    const targetRel = isExternalLink ? ' target="_blank" rel="noopener noreferrer"' : "";
    const html = `<a href="${customLinkUrl.trim()}"${targetRel} class="text-blue-600 font-semibold underline hover:text-blue-700">${textToUse}</a>`;
    
    const textarea = document.getElementById("articleContentTextarea");
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const newContent = text.substring(0, start) + html + text.substring(end);
      setArticleForm((current) => ({ ...current, content: newContent }));
    } else {
      setArticleForm((current) => ({ ...current, content: (current.content || "") + "\n" + html }));
    }
    setShowLinkModal(false);
    setCustomLinkUrl("");
    setCustomLinkText("");
  };

  const insertInternalServiceLink = (serviceName, path) => {
    const textarea = document.getElementById("articleContentTextarea");
    const selected = textarea ? textarea.value.substring(textarea.selectionStart, textarea.selectionEnd) : "";
    const text = selected.trim() || serviceName;
    const html = `<a href="${path}" class="text-blue-600 font-semibold underline hover:text-blue-700">${text}</a>`;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const current = textarea.value;
      const newContent = current.substring(0, start) + html + current.substring(end);
      setArticleForm((prev) => ({ ...prev, content: newContent }));
    } else {
      setArticleForm((prev) => ({ ...prev, content: (prev.content || "") + " " + html }));
    }
  };

  useEffect(() => {
    const savedToken = window.localStorage.getItem("verse_admin_token");
    if (savedToken) setToken(savedToken);
  }, []);

  const headers = useMemo(
    () => ({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const login = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.token) {
        throw new Error(payload.message || "Admin login failed.");
      }

      window.localStorage.setItem("verse_admin_token", payload.token);
      setToken(payload.token);
      setPassword("");
    } catch (loginError) {
      setError(loginError.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("verse_admin_token");
    setToken("");
    setData(emptyCollections);
  };

  const loadAdminData = async () => {
    if (!token) return;
    setError("");
    setLoading(true);

    try {
      const [dashboardRes, inquiriesRes, consultationsRes, leadsRes, articlesRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard`, { headers }),
        fetch(`${API_BASE}/admin/inquiries?per_page=20`, { headers }),
        fetch(`${API_BASE}/admin/consultations?per_page=20`, { headers }),
        fetch(`${API_BASE}/admin/leads?per_page=20`, { headers }),
        fetch(`${API_BASE}/admin/articles?per_page=30`, { headers }),
      ]);

      if ([dashboardRes, inquiriesRes, consultationsRes, leadsRes, articlesRes].some((response) => response.status === 401)) {
        logout();
        throw new Error("Session expired. Please login again.");
      }

      const [dashboard, inquiries, consultations, leads, articles] = await Promise.all([
        dashboardRes.json(),
        inquiriesRes.json(),
        consultationsRes.json(),
        leadsRes.json(),
        articlesRes.json(),
      ]);

      setData({
        dashboard: dashboard?.data || null,
        inquiries: normalizeCollection(inquiries),
        consultations: normalizeCollection(consultations),
        leads: normalizeCollection(leads),
        articles: normalizeCollection(articles),
      });
    } catch (loadError) {
      setError(loadError.message || "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const editArticle = (article) => {
    setActivePanel("articles");
    setArticleForm({
      id: article.id,
      title: article.title || "",
      slug: article.slug || "",
      category: article.category || "SEO",
      featured_image: article.featured_image || "",
      seo_title: article.seo_title || "",
      seo_description: article.seo_description || "",
      author: article.author || "Verse Next Editorial Team",
      reading_time: article.reading_time || 5,
      tags: Array.isArray(article.tags) ? article.tags.join(", ") : article.tags || "",
      content: article.content || "",
      status: article.status || "draft",
      is_featured: Boolean(article.is_featured),
      published_at: article.published_at ? String(article.published_at).slice(0, 16) : "",
      faqs: Array.isArray(article.faqs) ? article.faqs : [],
      internal_links: Array.isArray(article.internal_links) ? article.internal_links : [],
    });
    setSuccessMessage(`Loaded "${article.title}" into editor.`);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const resetArticleForm = () => {
    setArticleForm(emptyArticleForm);
    setSuccessMessage("");
  };

  const saveArticle = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    const payload = {
      ...articleForm,
      featured_image: articleForm.featured_image || null,
      tags: (articleForm.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      reading_time: Number(articleForm.reading_time) || 1,
      published_at: articleForm.published_at || null,
      slug: articleForm.slug || undefined,
      faqs: articleForm.faqs || [],
      internal_links: articleForm.internal_links || [],
    };

    try {
      const response = await fetch(`${API_BASE}/admin/articles${articleForm.id ? `/${articleForm.id}` : ""}`, {
        method: articleForm.id ? "PATCH" : "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(result.message || "Article could not be saved.");
      }

      setSuccessMessage(`Article "${articleForm.title}" saved successfully!`);
      resetArticleForm();
      await loadAdminData();
      setActivePanel("articles");
    } catch (saveError) {
      setError(saveError.message || "Article could not be saved.");
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (article) => {
    const confirmed = window.confirm(`Delete "${article.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/admin/articles/${article.id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error("Article could not be deleted.");
      }

      setSuccessMessage("Article deleted successfully.");
      await loadAdminData();
    } catch (deleteError) {
      setError(deleteError.message || "Article could not be deleted.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#f7f8fb] px-4 pb-16 pt-40">
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-[#071633]/10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071633] text-white">
              <Lock size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#071633]">Admin Panel</h1>
              <p className="text-sm text-slate-500">Manage quotes, inquiries, consultations, and leads.</p>
            </div>
          </div>

          <form onSubmit={login} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#071633]">Admin Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20"
                placeholder="admin@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#071633]">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20"
                placeholder="Password"
              />
            </label>

            {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-[#071633] px-5 py-3 font-semibold text-white transition hover:bg-[#4d61b7] disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login to Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb] px-4 pb-16 pt-36 sm:px-6 lg:px-8">
      {/* Custom Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#071633] mb-4">Insert Link / Backlink</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target URL (Internal path or External URL)</label>
                <input
                  type="text"
                  placeholder="/services/web-development or https://example.com"
                  value={customLinkUrl}
                  onChange={(e) => setCustomLinkUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#4d61b7]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Anchor Text / Display Text</label>
                <input
                  type="text"
                  placeholder="e.g. professional web development"
                  value={customLinkText}
                  onChange={(e) => setCustomLinkText(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#4d61b7]"
                />
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isExternalLink}
                  onChange={(e) => setIsExternalLink(e.target.checked)}
                  className="h-4 w-4 rounded text-[#4d61b7]"
                />
                Open in new tab (External backlink: target=&quot;_blank&quot; rel=&quot;noopener noreferrer&quot;)
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleApplyLink}
                  className="flex-1 rounded-xl bg-[#071633] py-2.5 text-sm font-semibold text-white hover:bg-[#4d61b7]"
                >
                  Insert Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-[#071633] p-6 text-white shadow-2xl shadow-[#071633]/15 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d7a915]">Verse Next Admin</div>
            <h1 className="text-3xl font-bold">Quotes, consultations and lead dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Review project inquiries, free consultation requests, chatbot leads, and business opportunities from one place.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadAdminData}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#071633] transition hover:bg-slate-100 disabled:opacity-60"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {error && <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
        {successMessage && <div className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</div>}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Inbox} label="Leads" value={data.dashboard?.leads} />
          <StatCard icon={MessageSquare} label="New Leads" value={data.dashboard?.new_leads} />
          <StatCard icon={Calendar} label="Consultations" value={data.dashboard?.consultations} />
          <StatCard icon={FileText} label="Published Articles" value={data.dashboard?.published_articles} />
        </div>

        <div className="mb-8 flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {[
            ["dashboard", "Leads Dashboard", BarChart3],
            ["articles", "Articles & Blogs", FileText],
          ].map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActivePanel(id)}
              className={`inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activePanel === id ? "bg-[#071633] text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {activePanel === "articles" ? (
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-[#071633]">
                    {articleForm.id ? `Editing Article #${articleForm.id}` : "Create SEO Article"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {articleForm.id ? "Make changes below and click Save Changes." : "Add a new SEO-optimized humanized article."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetArticleForm}
                  className="inline-flex items-center rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  New Article
                </button>
              </div>

              <form onSubmit={saveArticle} className="space-y-5">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Title</span>
                  <input
                    value={articleForm.title}
                    onChange={(event) => setArticleForm((current) => ({ ...current, title: event.target.value }))}
                    required
                    maxLength={255}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20 font-medium"
                    placeholder="How to build an SEO-ready website"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Slug / URL</span>
                    <input
                      value={articleForm.slug}
                      onChange={(event) => setArticleForm((current) => ({ ...current, slug: event.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20 font-mono"
                      placeholder="what-developers-need-in-the-age-of-ai"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Category</span>
                    <select
                      value={articleForm.category}
                      onChange={(event) => setArticleForm((current) => ({ ...current, category: event.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20"
                    >
                      {["SEO", "Web Development", "AI Automation", "Software", "Digital Marketing"].map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Featured Image URL / Path</span>
                    <input
                      value={articleForm.featured_image || ""}
                      onChange={(event) => setArticleForm((current) => ({ ...current, featured_image: event.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20 font-mono text-xs"
                      placeholder="/articles/what-developers-need-in-the-age-of-ai.png"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Author</span>
                    <input
                      value={articleForm.author}
                      onChange={(event) => setArticleForm((current) => ({ ...current, author: event.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#4d61b7]"
                      placeholder="Verse Next Editorial Team"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">SEO Meta Title</span>
                  <input
                    value={articleForm.seo_title}
                    onChange={(event) => setArticleForm((current) => ({ ...current, seo_title: event.target.value }))}
                    maxLength={255}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20"
                    placeholder="Engaging SEO title for search engines"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">SEO Meta Description</span>
                  <textarea
                    value={articleForm.seo_description}
                    onChange={(event) => setArticleForm((current) => ({ ...current, seo_description: event.target.value }))}
                    rows={2}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20"
                    placeholder="Human-written meta description that boosts CTR."
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block md:col-span-2">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Tags (comma-separated)</span>
                    <input
                      value={articleForm.tags}
                      onChange={(event) => setArticleForm((current) => ({ ...current, tags: event.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#4d61b7]"
                      placeholder="AI Development, Software Engineering, SEO"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Read Time (Mins)</span>
                    <input
                      type="number"
                      min="1"
                      value={articleForm.reading_time}
                      onChange={(event) => setArticleForm((current) => ({ ...current, reading_time: event.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#4d61b7]"
                    />
                  </label>
                </div>

                {/* Article Content & Rich Toolbar */}
                <div className="block pt-2">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Article Content (HTML Supported)</span>
                    <div className="flex rounded-xl bg-slate-100 p-1">
                      <button
                        type="button"
                        onClick={() => setEditorTab("code")}
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                          editorTab === "code" ? "bg-white text-[#071633] shadow-sm" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        HTML Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorTab("preview")}
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                          editorTab === "preview" ? "bg-white text-[#071633] shadow-sm" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Live Visual Preview
                      </button>
                    </div>
                  </div>
                  
                  {/* Formatting Toolbar */}
                  <div className="mb-3 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Tags:</span>
                      <button
                        type="button"
                        onClick={() => insertAtCursor("<strong>", "</strong>")}
                        className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-100"
                        title="Bold tag"
                      >
                        &lt;strong&gt;
                      </button>
                      <button
                        type="button"
                        onClick={() => insertAtCursor("<em>", "</em>")}
                        className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold italic text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-100"
                        title="Italic tag"
                      >
                        &lt;em&gt;
                      </button>
                      <button
                        type="button"
                        onClick={() => insertAtCursor("<h2>", "</h2>")}
                        className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-100"
                        title="Section Heading"
                      >
                        &lt;h2&gt;
                      </button>
                      <button
                        type="button"
                        onClick={() => insertAtCursor("<h3>", "</h3>")}
                        className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-100"
                        title="Subheading"
                      >
                        &lt;h3&gt;
                      </button>
                      <button
                        type="button"
                        onClick={() => insertAtCursor("<p>", "</p>")}
                        className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-100"
                        title="Paragraph"
                      >
                        &lt;p&gt;
                      </button>
                      <button
                        type="button"
                        onClick={() => insertAtCursor('<ul class="list-disc pl-6 my-4 space-y-2">\n  <li>', "</li>\n  <li>Second item</li>\n</ul>")}
                        className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-100"
                        title="Bullet list"
                      >
                        &lt;ul&gt; List
                      </button>
                      <button
                        type="button"
                        onClick={() => insertAtCursor('<blockquote class="border-l-4 border-[#4d61b7] pl-4 italic text-slate-700 my-4">\n  ', "\n</blockquote>")}
                        className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-100"
                        title="Blockquote"
                      >
                        Quote Box
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenLinkModal}
                        className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm border border-indigo-200 hover:bg-indigo-100"
                        title="Insert Custom Link or Backlink"
                      >
                        🔗 Insert Link / Backlink
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const src = window.prompt("Enter Image URL / Path:", "/articles/what-developers-need-in-the-age-of-ai.png");
                          const alt = window.prompt("Enter Image Alt Description:", "image description");
                          if (src) {
                            insertAtCursor(`<img src="${src}" alt="${alt || 'article illustration'}" class="rounded-2xl w-full my-6 shadow-md" />\n`);
                          }
                        }}
                        className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-100"
                        title="Insert Image"
                      >
                        🖼️ Add Image
                      </button>
                    </div>

                    {/* Quick Internal Linking Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/70">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Quick Internal Links:</span>
                      {[
                        ["Web Dev", "/services/web-development"],
                        ["AI Automation", "/services/ai-automation"],
                        ["SEO Optimization", "/services/seo-optimization"],
                        ["UI/UX Design", "/services/ui-ux-design"],
                        ["Digital Marketing", "/services/digital-marketing"],
                        ["Contact Page", "/contact"],
                        ["Why Devs Fail Large Projects", "/articles/why-good-developers-fail-large-projects"],
                        ["Devs in Age of AI", "/articles/what-developers-need-in-the-age-of-ai"],
                      ].map(([label, path]) => (
                        <button
                          key={path}
                          type="button"
                          onClick={() => insertInternalServiceLink(label, path)}
                          className="rounded-lg bg-slate-200/80 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-[#071633] hover:text-white transition"
                        >
                          + {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {editorTab === "code" ? (
                    <textarea
                      id="articleContentTextarea"
                      value={articleForm.content}
                      onChange={(event) => setArticleForm((current) => ({ ...current, content: event.target.value }))}
                      required
                      rows={14}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 font-mono text-sm leading-relaxed outline-none transition focus:border-[#4d61b7] focus:ring-2 focus:ring-[#4d61b7]/20"
                      placeholder="<p>Write your article content with HTML tags, headings, and internal links...</p>"
                    />
                  ) : (
                    <div className="min-h-[350px] max-h-[500px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-inner prose prose-slate max-w-none">
                      {articleForm.content ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: articleForm.content }}
                          className="space-y-4 text-slate-700 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#071633] [&_h2]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#071633] [&_h3]:mt-4 [&_a]:text-blue-600 [&_a]:font-semibold [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#4d61b7] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-700"
                        />
                      ) : (
                        <div className="text-center text-sm text-slate-400 py-12">No content to preview. Type or paste HTML in the Code tab.</div>
                      )}
                    </div>
                  )}
                </div>

                {/* FAQs Manager */}
                <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Article FAQs ({articleForm.faqs.length})</h3>
                  </div>
                  
                  {articleForm.faqs.length > 0 && (
                    <div className="space-y-2">
                      {articleForm.faqs.map((faq, index) => (
                        <div key={index} className="flex justify-between items-start gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-xs">
                          <div>
                            <div className="font-semibold text-slate-800">Q: {faq.question}</div>
                            <div className="text-slate-500 mt-1 leading-relaxed">A: {faq.answer}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setArticleForm((current) => ({
                                ...current,
                                faqs: current.faqs.filter((_, i) => i !== index),
                              }));
                            }}
                            className="text-red-600 hover:underline shrink-0 font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2 pt-2 border-t border-slate-200/60">
                    <input
                      type="text"
                      placeholder="FAQ Question"
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#4d61b7]"
                    />
                    <textarea
                      placeholder="FAQ Answer"
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#4d61b7]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!faqQuestion.trim() || !faqAnswer.trim()) return;
                        setArticleForm((current) => ({
                          ...current,
                          faqs: [...current.faqs, { question: faqQuestion.trim(), answer: faqAnswer.trim() }],
                        }));
                        setFaqQuestion("");
                        setFaqAnswer("");
                      }}
                      className="rounded-xl bg-[#071633] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#4d61b7]"
                    >
                      + Add FAQ
                    </button>
                  </div>
                </div>

                {/* Call to action links */}
                <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Internal Call-to-Action Links ({articleForm.internal_links.length})</h3>
                  
                  {articleForm.internal_links.length > 0 && (
                    <div className="space-y-2">
                      {articleForm.internal_links.map((link, index) => (
                        <div key={index} className="flex justify-between items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-xs">
                          <div>
                            <span className="font-semibold text-slate-800">{link.label}</span>
                            <span className="text-slate-400 ml-2">({link.href})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setArticleForm((current) => ({
                                ...current,
                                internal_links: current.internal_links.filter((_, i) => i !== index),
                              }));
                            }}
                            className="text-red-600 hover:underline shrink-0 font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid gap-2 grid-cols-2 pt-2 border-t border-slate-200/60 items-end">
                    <div>
                      <input
                        type="text"
                        placeholder="Link Label (e.g. Explore Web Dev)"
                        value={linkLabel}
                        onChange={(e) => setLinkLabel(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#4d61b7]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Link Href (e.g. /services/web-development)"
                        value={linkHref}
                        onChange={(e) => setLinkHref(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#4d61b7]"
                      />
                    </div>
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!linkLabel.trim() || !linkHref.trim()) return;
                          setArticleForm((current) => ({
                            ...current,
                            internal_links: [...current.internal_links, { label: linkLabel.trim(), href: linkHref.trim() }],
                          }));
                          setLinkLabel("");
                          setLinkHref("");
                        }}
                        className="rounded-xl bg-[#071633] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#4d61b7]"
                      >
                        + Add Call-to-Action Link
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Status</span>
                    <select
                      value={articleForm.status}
                      onChange={(event) => setArticleForm((current) => ({ ...current, status: event.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#4d61b7]"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Published At</span>
                    <input
                      type="datetime-local"
                      value={articleForm.published_at}
                      onChange={(event) => setArticleForm((current) => ({ ...current, published_at: event.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none transition focus:border-[#4d61b7]"
                    />
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#071633] cursor-pointer mt-auto">
                    <input
                      type="checkbox"
                      checked={articleForm.is_featured}
                      onChange={(event) => setArticleForm((current) => ({ ...current, is_featured: event.target.checked }))}
                      className="h-4 w-4 rounded text-[#4d61b7]"
                    />
                    Featured Article
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#071633] px-5 py-3.5 font-semibold text-white transition hover:bg-[#4d61b7] disabled:opacity-60 shadow-lg shadow-[#071633]/15 text-sm"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {articleForm.id ? "Save Changes (Update Article)" : "Publish Article"}
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#071633]">All Articles</h2>
                  <p className="text-xs text-slate-500">Click &quot;Edit&quot; on any article to update content and links.</p>
                </div>
                <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-semibold text-[#4d61b7]">
                  {data.articles.length} total
                </span>
              </div>
              <div className="space-y-4 max-h-[900px] overflow-y-auto pr-1">
                {data.articles.length === 0 ? (
                  <EmptyState text="No article found in database yet. Use the form on the left to create one or run the Database Seeder." />
                ) : (
                  data.articles.map((article) => (
                    <article
                      key={article.id}
                      className={`rounded-2xl border p-4 transition ${
                        articleForm.id === article.id
                          ? "border-[#4d61b7] bg-indigo-50/40 ring-2 ring-[#4d61b7]/20"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
                      }`}
                    >
                      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-[#071633] leading-snug">{article.title}</h3>
                          <div className="mt-1 text-xs font-semibold text-[#4d61b7]">/articles/{article.slug}</div>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          article.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                        }`}>
                          {article.status}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">{article.seo_description || "No SEO description added."}</p>
                      
                      <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => editArticle(article)}
                          className="inline-flex items-center rounded-lg bg-[#071633] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#4d61b7] transition"
                        >
                          <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                          Edit Article
                        </button>
                        <a
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          View Live ↗
                        </a>
                        <button
                          type="button"
                          onClick={() => deleteArticle(article)}
                          className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 ml-auto"
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        ) : (
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#071633]">Project Quotes & Inquiries</h2>
              <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-semibold text-[#4d61b7]">
                {data.inquiries.length} latest
              </span>
            </div>
            <div className="space-y-4">
              {data.inquiries.length === 0 ? (
                <EmptyState text="No quote or project inquiry found yet." />
              ) : (
                data.inquiries.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-[#071633]">{item.full_name || "Unknown visitor"}</h3>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">{item.status || "new"}</span>
                    </div>
                    <div className="mb-3 text-sm font-semibold text-[#4d61b7]">{item.service_needed || "Project inquiry"}</div>
                    <p className="mb-3 text-sm leading-6 text-slate-600">{item.project_details || "No details provided."}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1"><Mail size={14} /> {item.email || "No email"}</span>
                      <span className="inline-flex items-center gap-1"><Phone size={14} /> {item.phone || "No phone"}</span>
                      <span>{item.created_at}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#071633]">Free Consultations</h2>
                <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-semibold text-[#4d61b7]">
                  {data.consultations.length} latest
                </span>
              </div>
              <div className="space-y-3">
                {data.consultations.length === 0 ? (
                  <EmptyState text="No consultation request found yet." />
                ) : (
                  data.consultations.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 font-bold text-[#071633]">
                        <User size={16} /> {item.name || "Consultation request"}
                      </div>
                      <div className="mt-2 text-sm text-slate-600">{item.service || "General consultation"}</div>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>{item.email}</span>
                        <span>{item.phone}</span>
                        <span>{item.status || "requested"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#071633]">Leads</h2>
                <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-semibold text-[#4d61b7]">
                  {data.leads.length} latest
                </span>
              </div>
              <div className="space-y-3">
                {data.leads.length === 0 ? (
                  <EmptyState text="No lead found yet." />
                ) : (
                  data.leads.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 font-bold text-[#071633]">
                        <CheckCircle size={16} /> {item.name || item.source || "Lead"}
                      </div>
                      <div className="mt-2 text-sm text-slate-600">{item.service || item.notes || "Lead captured from website."}</div>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>{item.email || "No email"}</span>
                        <span>{item.phone || item.whatsapp || "No phone"}</span>
                        <span>{item.status || "new"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
