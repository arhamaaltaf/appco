// In-memory mock so the UI is fully demoable without a backend.
// Remove or ignore when VITE_API_URL is set.
import type { SignupPayload, SignupResponse, StatusResponse } from "./api";

interface Job {
  startedAt: number;
  companyName: string;
}

const jobs = new Map<string, Job>();

export async function signup(payload: SignupPayload): Promise<SignupResponse> {
  await delay(600);
  const jobId = `job_${Math.random().toString(36).slice(2, 10)}`;
  jobs.set(jobId, { startedAt: Date.now(), companyName: payload.companyName });
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

  const slug = job.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "workspace";
  return { status: "ready", progress: 1, siteUrl: `https://${slug}.forgeerp.app` };
}

export async function subscribeNewsletter(_email: string) {
  await delay(400);
  return { ok: true as const };
}

export async function bookDemo(_p: unknown) {
  await delay(500);
  return { ok: true as const };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
