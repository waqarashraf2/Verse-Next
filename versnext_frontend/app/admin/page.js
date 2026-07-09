"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Inbox,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  User,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.versenext.com/api";

const emptyCollections = {
  dashboard: null,
  inquiries: [],
  consultations: [],
  leads: [],
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
      const [dashboardRes, inquiriesRes, consultationsRes, leadsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard`, { headers }),
        fetch(`${API_BASE}/admin/inquiries?per_page=20`, { headers }),
        fetch(`${API_BASE}/admin/consultations?per_page=20`, { headers }),
        fetch(`${API_BASE}/admin/leads?per_page=20`, { headers }),
      ]);

      if ([dashboardRes, inquiriesRes, consultationsRes, leadsRes].some((response) => response.status === 401)) {
        logout();
        throw new Error("Session expired. Please login again.");
      }

      const [dashboard, inquiries, consultations, leads] = await Promise.all([
        dashboardRes.json(),
        inquiriesRes.json(),
        consultationsRes.json(),
        leadsRes.json(),
      ]);

      setData({
        dashboard: dashboard?.data || null,
        inquiries: normalizeCollection(inquiries),
        consultations: normalizeCollection(consultations),
        leads: normalizeCollection(leads),
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

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Inbox} label="Leads" value={data.dashboard?.leads} />
          <StatCard icon={MessageSquare} label="New Leads" value={data.dashboard?.new_leads} />
          <StatCard icon={Calendar} label="Consultations" value={data.dashboard?.consultations} />
          <StatCard icon={BarChart3} label="Knowledge Entries" value={data.dashboard?.knowledge_entries} />
        </div>

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
      </div>
    </div>
  );
}
