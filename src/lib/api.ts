// Thin API client. Reads the broker URL from VITE_BROKER_URL and falls back to VITE_API_URL.
import * as mock from "./api.mock";

const BASE = (import.meta.env.VITE_BROKER_URL || import.meta.env.VITE_API_URL) as string | undefined;
const DOMAIN_SUFFIX = import.meta.env.VITE_DOMAIN_SUFFIX as string | undefined;

export type PlanId = "starter" | "growth" | "enterprise";

export interface SignupPayload {
  companyName: string;
  email: string;
  password: string;
  plan: PlanId;
}

export interface SignupResponse {
  jobId: string;
  site?: string;
}

export type ProvisioningStatus =
  | "pending"
  | "provisioning"
  | "installing"
  | "configuring"
  | "ready"
  | "failed";

export interface StatusResponse {
  status: ProvisioningStatus;
  stage?: string;
  progress?: number;
  siteUrl?: string;
  error?: string;
}

interface BrokerRegisterResponse {
  jobId?: string;
  id?: string;
  site?: string;
  error?: string;
}

interface BrokerStatusResponse {
  id?: string;
  state?: string;
  progress?: number;
  returnvalue?: {
    site?: string;
  };
  failedReason?: string;
  error?: string;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

function toSiteUrl(site?: string): string | undefined {
  if (!site) return undefined;
  const normalized = site.trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(normalized)) return normalized;

  const hasPort = /:\d+$/.test(normalized);
  const alreadyHasDomain = normalized.includes(".") || normalized.includes(":") || normalized.startsWith("localhost");

  if (alreadyHasDomain) {
    return `http://${normalized}${hasPort ? "" : ":8000"}`;
  }

  if (DOMAIN_SUFFIX) {
    return `http://${normalized}.${DOMAIN_SUFFIX}${hasPort ? "" : ":8000"}`;
  }

  return `http://${normalized}:8000`;
}

function normalizeStatus(raw: BrokerStatusResponse): StatusResponse {
  const state = raw.state?.toLowerCase();
  const site = raw.returnvalue?.site;
  const progress = typeof raw.progress === "number" ? Math.max(0, Math.min(100, raw.progress)) : undefined;

  switch (state) {
    case "completed":
      return { status: "ready", stage: "ready", progress: 100, siteUrl: toSiteUrl(site) };
    case "active":
      return { status: "provisioning", stage: "installing", progress: progress ?? 60 };
    case "failed":
      return {
        status: "failed",
        stage: "failed",
        progress: progress ?? 0,
        error: raw.failedReason || raw.error || "Provisioning failed",
      };
    case "waiting":
      return { status: "provisioning", stage: "creating", progress: progress ?? 5 };
    case "running":
    case "in_progress":
    case "provisioning":
      return { status: "provisioning", stage: "installing", progress: progress ?? 60 };
    default:
      return { status: "pending", stage: "creating", progress: progress ?? 5 };
  }
}

export async function signup(payload: SignupPayload): Promise<SignupResponse> {
  if (!BASE) return mock.signup(payload);

  const { companyName, email, password, plan } = payload;
  const response = await req<BrokerRegisterResponse>("/api/register", {
    method: "POST",
    body: JSON.stringify({ companyName, email, password, plan }),
  });

  const jobId = response.jobId || response.id;
  if (!jobId) throw new Error(response.error || "Registration failed");

  return { jobId, site: response.site };
}

export async function getSignupStatus(jobId: string): Promise<StatusResponse> {
  if (!BASE) return mock.getSignupStatus(jobId);
  const response = await req<BrokerStatusResponse>(`/api/status/${jobId}`);
  return normalizeStatus(response);
}

export async function subscribeNewsletter(email: string): Promise<{ ok: true }> {
  if (!BASE) return mock.subscribeNewsletter(email);
  return req("/newsletter", { method: "POST", body: JSON.stringify({ email }) });
}

export async function bookDemo(payload: {
  name: string;
  email: string;
  company: string;
  message?: string;
}): Promise<{ ok: true }> {
  if (!BASE) return mock.bookDemo(payload);
  return req("/demo", { method: "POST", body: JSON.stringify(payload) });
}
