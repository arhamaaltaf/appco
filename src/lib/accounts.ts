import { BROKER_URL } from "./broker-config";

export const accountsEnabled = Boolean(BROKER_URL && import.meta.env.VITE_APPCO_ACCOUNTS === "1");

export function accountStart(params: { mode?: "signup"; plan?: string; site?: string } = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value);
  }
  return `${BROKER_URL}/auth/start${query.size ? `?${query}` : ""}`;
}

export async function accountEmail(signal: AbortSignal): Promise<string | null> {
  const response = await fetch(`${BROKER_URL}/auth/session`, {
    credentials: "include",
    signal,
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Appco sign-in is temporarily unavailable.");
  const { email } = (await response.json()) as { email: string };
  return email;
}
