// Admin API client. Frontend-only with mock data fallback.
// In production, wire these up to your Node/Express backend via VITE_API_URL.
const BASE = import.meta.env.VITE_API_URL as string | undefined;

// Demo credentials — replace with real auth against your backend.
const DEMO_ADMIN_EMAIL = "admin@appco.app";
const DEMO_ADMIN_PASSWORD = "admin123";

export const ADMIN_TOKEN_KEY = "forge_admin_token";

export type PlanId = "starter" | "growth" | "enterprise";
export type SubscriberStatus = "active" | "provisioning" | "past_due" | "canceled";

export interface Subscriber {
  id: string;
  companyName: string;
  email: string;
  plan: PlanId;
  status: SubscriberStatus;
  mrr: number; // monthly recurring revenue in USD
  createdAt: string; // ISO
  siteUrl: string;
  seats: number;
  lastActive: string; // ISO
}

export interface AdminStats {
  totalSubscribers: number;
  activeSubscribers: number;
  mrr: number;
  arr: number;
  churnRate: number; // 0..1
  newThisMonth: number;
  planBreakdown: { plan: PlanId; count: number; mrr: number }[];
  revenueByMonth: { month: string; revenue: number }[];
}

interface SubscriberApiRecord {
  id?: string;
  companyName?: string;
  name?: string;
  email?: string;
  ownerEmail?: string;
  plan?: string;
  status?: string;
  mrr?: number;
  monthlyRecurringRevenue?: number;
  createdAt?: string;
  created_at?: string;
  siteUrl?: string;
  site_url?: string;
  url?: string;
  seats?: number;
  lastActive?: string;
  last_active?: string;
}

interface AdminStatsApiResponse {
  totalSubscribers?: number;
  total_subscribers?: number;
  activeSubscribers?: number;
  active_subscribers?: number;
  mrr?: number;
  arr?: number;
  churnRate?: number;
  churn_rate?: number;
  newThisMonth?: number;
  new_this_month?: number;
  planBreakdown?: { plan?: string; count?: number; mrr?: number }[];
  plan_breakdown?: { plan?: string; count?: number; mrr?: number }[];
  revenueByMonth?: { month?: string; revenue?: number }[];
  revenue_by_month?: { month?: string; revenue?: number }[];
}

const PLAN_PRICE: Record<PlanId, number> = {
  starter: 49,
  growth: 149,
  enterprise: 499,
};

const COMPANIES = [
  "Northwind Textiles", "Acme Robotics", "Blue Harbor Foods", "Meridian Health",
  "Copperleaf Interiors", "Vertex Manufacturing", "Sable & Stone Co.", "Lumen Optics",
  "Orbital Freight", "Palladium Chemicals", "Ridgeway Motors", "Sunfield Agritech",
  "Trellis Software", "Umbra Design Studio", "Wavecrest Marine", "Xanadu Hotels",
  "Yellowpine Lumber", "Zephyr Wind Systems", "Ashford Legal", "Brightline Analytics",
  "Cedarpoint Beverages", "Dockside Logistics", "Emberline Ceramics", "Foundry Metalworks",
];

function coercePlan(plan: unknown): PlanId {
  return plan === "starter" || plan === "growth" || plan === "enterprise" ? plan : "growth";
}

function coerceStatus(status: unknown): SubscriberStatus {
  return status === "active" || status === "provisioning" || status === "past_due" || status === "canceled"
    ? status
    : "active";
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normalizeSiteUrl(raw: unknown, companyName: string): string {
  const value = asString(raw);
  if (value) {
    const normalized = value.replace(/\/$/, "");
    if (/^https?:\/\//i.test(normalized)) return normalized;
    return `https://${normalized}`;
  }
  return `https://${slugify(companyName || "workspace")}.appco.app`;
}

function normalizeSubscriber(record: SubscriberApiRecord): Subscriber {
  const companyName =
    asString(record.companyName) || asString(record.name) || "Untitled site";
  const email =
    asString(record.email) || asString(record.ownerEmail) || "unknown@example.com";
  const plan = coercePlan(asString(record.plan));
  const status = coerceStatus(asString(record.status));
  const createdAt =
    asString(record.createdAt) || asString(record.created_at) || new Date().toISOString();
  const seats = asNumber(record.seats) || (plan === "starter" ? 5 : plan === "growth" ? 15 : 50);
  const mrr =
    asNumber(record.mrr) ||
    asNumber(record.monthlyRecurringRevenue) ||
    (status === "canceled" ? 0 : PLAN_PRICE[plan] * Math.max(1, Math.round((seats || 1) / 10)));
  const siteUrl = normalizeSiteUrl(asString(record.siteUrl) || asString(record.site_url) || asString(record.url), companyName);
  const lastActive = asString(record.lastActive) || asString(record.last_active) || createdAt;
  const id = asString(record.id) || `${slugify(companyName)}-${slugify(email)}` || `sub_${Math.random().toString(36).slice(2, 10)}`;

  return {
    id,
    companyName,
    email,
    plan,
    status,
    mrr,
    createdAt,
    siteUrl,
    seats: seats || 1,
    lastActive,
  };
}

function revenueByMonthFrom(subscribers: Subscriber[]): { month: string; revenue: number }[] {
  const revenueByMonth = new Map<string, number>();
  for (const subscriber of subscribers) {
    if (subscriber.status === "canceled") continue;
    const month = new Date(subscriber.createdAt).toLocaleString("en", { month: "short" });
    revenueByMonth.set(month, (revenueByMonth.get(month) || 0) + subscriber.mrr);
  }

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return date.toLocaleString("en", { month: "short" });
  });

  return months.map((month, index) => ({
    month,
    revenue: Math.round((revenueByMonth.get(month) || 0) * (0.85 + index * 0.02)),
  }));
}

function deriveStats(subscribers: Subscriber[]): AdminStats {
  const active = subscribers.filter((subscriber) => subscriber.status !== "canceled");
  const mrr = active.reduce((sum, subscriber) => sum + subscriber.mrr, 0);
  const plans: PlanId[] = ["starter", "growth", "enterprise"];
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const newThisMonth = subscribers.filter((subscriber) => {
    const created = new Date(subscriber.createdAt);
    return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
  }).length;

  return {
    totalSubscribers: subscribers.length,
    activeSubscribers: active.length,
    mrr,
    arr: mrr * 12,
    churnRate: subscribers.length === 0 ? 0 : subscribers.filter((subscriber) => subscriber.status === "canceled").length / subscribers.length,
    newThisMonth,
    planBreakdown: plans.map((plan) => ({
      plan,
      count: active.filter((subscriber) => subscriber.plan === plan).length,
      mrr: active.filter((subscriber) => subscriber.plan === plan).reduce((sum, subscriber) => sum + subscriber.mrr, 0),
    })),
    revenueByMonth: revenueByMonthFrom(subscribers),
  };
}

function normalizePlanBreakdown(items?: { plan?: string; count?: number; mrr?: number }[]) {
  const plans: PlanId[] = ["starter", "growth", "enterprise"];
  if (!items?.length) return undefined;
  return plans.map((plan) => {
    const item = items.find((entry) => coercePlan(entry.plan) === plan);
    return {
      plan,
      count: asNumber(item?.count) || 0,
      mrr: asNumber(item?.mrr) || 0,
    };
  });
}

function normalizeRevenueByMonth(items?: { month?: string; revenue?: number }[]) {
  if (!items?.length) return undefined;
  return items.map((item) => ({ month: asString(item.month) || "", revenue: asNumber(item.revenue) || 0 })).filter((item) => item.month);
}

function normalizeStats(raw: AdminStatsApiResponse, subscribers?: Subscriber[]): AdminStats {
  const fallback = subscribers ? deriveStats(subscribers) : undefined;
  const planBreakdown = normalizePlanBreakdown(raw.planBreakdown || raw.plan_breakdown) || fallback?.planBreakdown || [];
  const revenueByMonth = normalizeRevenueByMonth(raw.revenueByMonth || raw.revenue_by_month) || fallback?.revenueByMonth || [];
  return {
    totalSubscribers: asNumber(raw.totalSubscribers) || asNumber(raw.total_subscribers) || fallback?.totalSubscribers || 0,
    activeSubscribers: asNumber(raw.activeSubscribers) || asNumber(raw.active_subscribers) || fallback?.activeSubscribers || 0,
    mrr: asNumber(raw.mrr) || fallback?.mrr || 0,
    arr: asNumber(raw.arr) || fallback?.arr || 0,
    churnRate: asNumber(raw.churnRate) || asNumber(raw.churn_rate) || fallback?.churnRate || 0,
    newThisMonth: asNumber(raw.newThisMonth) || asNumber(raw.new_this_month) || fallback?.newThisMonth || 0,
    planBreakdown,
    revenueByMonth,
  };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function adminLogin(email: string, password: string): Promise<{ token: string }> {
  if (BASE) {
    const res = await fetch(`${BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    return res.json();
  }
  await delay(500);
  if (email.trim().toLowerCase() !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
    throw new Error("Invalid credentials");
  }
  return { token: `demo_${Math.random().toString(36).slice(2)}` };
}

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? sessionStorage.getItem(ADMIN_TOKEN_KEY) : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAdminSubscribers(): Promise<Subscriber[]> {
  if (BASE) {
    const res = await fetch(`${BASE}/admin/subscribers`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to load subscribers");
    const data = (await res.json()) as SubscriberApiRecord[] | { subscribers?: SubscriberApiRecord[]; items?: SubscriberApiRecord[] };
    const records = Array.isArray(data) ? data : data.subscribers || data.items || [];
    return records.map(normalizeSubscriber);
  }
  return [];
}

export async function getAdminStats(): Promise<AdminStats> {
  if (BASE) {
    const res = await fetch(`${BASE}/admin/stats`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to load stats");
    const raw = (await res.json()) as AdminStatsApiResponse;
    const stats = normalizeStats(raw);

    if (!stats.planBreakdown.length || !stats.revenueByMonth.length) {
      const subscribers = await getAdminSubscribers();
      return normalizeStats(raw, subscribers);
    }

    return stats;
  }
  return {
    totalSubscribers: 0,
    activeSubscribers: 0,
    mrr: 0,
    arr: 0,
    churnRate: 0,
    newThisMonth: 0,
    planBreakdown: [
      { plan: "starter", count: 0, mrr: 0 },
      { plan: "growth", count: 0, mrr: 0 },
      { plan: "enterprise", count: 0, mrr: 0 },
    ],
    revenueByMonth: [],
  };
}
