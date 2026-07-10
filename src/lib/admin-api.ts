// Admin API client. Frontend-only with mock data fallback.
// In production, wire these up to your Node/Express backend via VITE_API_URL.
const BASE = import.meta.env.VITE_API_URL as string | undefined;

// Demo credentials — replace with real auth against your backend.
const DEMO_ADMIN_EMAIL = "admin@forgeerp.app";
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

function seedSubscribers(): Subscriber[] {
  const plans: PlanId[] = ["starter", "growth", "enterprise"];
  const statuses: SubscriberStatus[] = ["active", "active", "active", "active", "provisioning", "past_due", "canceled"];
  const now = Date.now();
  return COMPANIES.map((name, i) => {
    const plan = plans[(i * 7) % 3] as PlanId;
    const status = statuses[i % statuses.length];
    const seats = plan === "starter" ? 5 + (i % 8) : plan === "growth" ? 15 + (i % 20) : 50 + (i % 80);
    const createdDaysAgo = 3 + ((i * 13) % 400);
    const activeDaysAgo = (i * 3) % 14;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
      id: `sub_${(1000 + i).toString(36)}`,
      companyName: name,
      email: `admin@${slug}.com`,
      plan,
      status,
      mrr: status === "canceled" ? 0 : PLAN_PRICE[plan] * Math.max(1, Math.round(seats / 10)),
      createdAt: new Date(now - createdDaysAgo * 86400000).toISOString(),
      siteUrl: `https://${slug}.forgeerp.app`,
      seats,
      lastActive: new Date(now - activeDaysAgo * 86400000).toISOString(),
    };
  });
}

const SUBSCRIBERS = seedSubscribers();

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
    return res.json();
  }
  await delay(300);
  return SUBSCRIBERS;
}

export async function getAdminStats(): Promise<AdminStats> {
  if (BASE) {
    const res = await fetch(`${BASE}/admin/stats`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to load stats");
    return res.json();
  }
  await delay(300);
  const active = SUBSCRIBERS.filter((s) => s.status !== "canceled");
  const mrr = active.reduce((sum, s) => sum + s.mrr, 0);
  const plans: PlanId[] = ["starter", "growth", "enterprise"];
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const newThisMonth = SUBSCRIBERS.filter((s) => {
    const d = new Date(s.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
  const revenueByMonth: { month: string; revenue: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(thisYear, thisMonth - i, 1);
    const label = d.toLocaleString("en", { month: "short" });
    const base = mrr * (0.55 + (11 - i) * 0.04);
    revenueByMonth.push({ month: label, revenue: Math.round(base) });
  }
  return {
    totalSubscribers: SUBSCRIBERS.length,
    activeSubscribers: active.length,
    mrr,
    arr: mrr * 12,
    churnRate: SUBSCRIBERS.filter((s) => s.status === "canceled").length / SUBSCRIBERS.length,
    newThisMonth,
    planBreakdown: plans.map((p) => ({
      plan: p,
      count: active.filter((s) => s.plan === p).length,
      mrr: active.filter((s) => s.plan === p).reduce((sum, s) => sum + s.mrr, 0),
    })),
    revenueByMonth,
  };
}
