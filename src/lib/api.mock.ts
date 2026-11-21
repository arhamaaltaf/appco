// In-memory mock so the UI is fully demoable without a backend.
// Remove or ignore when VITE_API_URL is set.
import type { SignupPayload, SignupResponse, StatusResponse } from "./api";
import type { PlanId } from "./admin-api";

interface Job {
  startedAt: number;
  companyName: string;
  email: string;
  plan: PlanId;
}

export interface MockSubscriber {
  id: string;
  companyName: string;
  email: string;
  plan: PlanId;
  status: "provisioning" | "active";
  mrr: number;
  createdAt: string;
  siteUrl: string;
  seats: number;
  lastActive: string;
}

const jobs = new Map<string, Job>();
const subscribers = new Map<string, MockSubscriber>();

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function planPrice(plan: PlanId): number {
  return plan === "starter" ? 49 : plan === "growth" ? 149 : 449;
}

function registerSubscriber(payload: SignupPayload, jobId: string): MockSubscriber {
  const slug = slugify(payload.companyName) || "workspace";
  const createdAt = new Date().toISOString();
  const record: MockSubscriber = {
    id: jobId,
    companyName: payload.companyName,
    email: payload.email,
    plan: payload.plan,
    status: "provisioning",
    mrr: planPrice(payload.plan),
    createdAt,
    siteUrl: `https://${slug}.appco.app`,
    seats: payload.plan === "starter" ? 5 : payload.plan === "growth" ? 15 : 50,
    lastActive: createdAt,
  };
  subscribers.set(jobId, record);
  return record;
}

export async function signup(payload: SignupPayload): Promise<SignupResponse> {
  await delay(600);
  const jobId = `job_${Math.random().toString(36).slice(2, 10)}`;
  jobs.set(jobId, { startedAt: Date.now(), companyName: payload.companyName, email: payload.email, plan: payload.plan });
  registerSubscriber(payload, jobId);
  return { jobId };
}

export async function getSignupStatus(jobId: string): Promise<StatusResponse> {
  await delay(300);
  const job = jobs.get(jobId);
  if (!job) return { status: "failed", error: "Job not found" };
  const elapsed = Date.now() - job.startedAt;

  // 4 stages over ~16s for demo
  if (elapsed < 4000) return { status: "provisioning", stage: "creating", progress: elapsed / 16000 };
  if (elapsed < 9000) return { status: "installing", stage: "installing", progress: elapsed / 16000 };
  if (elapsed < 14000) return { status: "configuring", stage: "configuring", progress: elapsed / 16000 };
  if (elapsed < 16000) return { status: "configuring", stage: "finalizing", progress: elapsed / 16000 };

  const subscriber = subscribers.get(jobId);
  if (subscriber) {
    subscriber.status = "active";
  }
  const slug = job.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "workspace";
  return { status: "ready", progress: 1, siteUrl: `https://${slug}.appco.app` };
}

export function listMockSubscribers(): MockSubscriber[] {
  return Array.from(subscribers.values());
}

export async function subscribeNewsletter(_email: string) {
  await delay(400);
  return { ok: true as const };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
