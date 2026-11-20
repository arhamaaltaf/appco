import { BROKER_URL } from "./broker-config";

export const accountsEnabled = Boolean(BROKER_URL && import.meta.env.VITE_APPCO_ACCOUNTS === "1");
export const accountSignInUrl = `${BROKER_URL}/auth/start`;
