import { BROKER_URL } from "./broker-config";

export const accountsEnabled = Boolean(BROKER_URL?.startsWith("https://") && import.meta.env.VITE_APPCO_ACCOUNTS === "1");
export const accountLoginEndpoint = `${BROKER_URL}/auth/login`;
