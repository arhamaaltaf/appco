// Thin API client. Reads VITE_API_URL; falls back to a local mock for demo.
import * as mock from "./api.mock";

const BASE = import.meta.env.VITE_API_URL as string | undefined;

export type PlanId = "starter" | "growth" | "enterprise";

export interface SignupPayload {
  companyName: string;
  email: string;
  password: string;
  plan: PlanId;
}

export interface SignupResponse {
  jobId: string;
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

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function signup(payload: SignupPayload): Promise<SignupResponse> {
  if (!BASE) return mock.signup(payload);
  return req<SignupResponse>("/signup", { method: "POST", body: JSON.stringify(payload) });
}

export async function getSignupStatus(jobId: string): Promise<StatusResponse> {
  if (!BASE) return mock.getSignupStatus(jobId);
  return req<StatusResponse>(`/signup/status/${jobId}`);
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
