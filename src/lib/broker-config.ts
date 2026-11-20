export const BROKER_URL = (
  import.meta.env.VITE_BROKER_URL?.trim() || import.meta.env.VITE_API_URL?.trim()
)?.replace(/\/+$/, "");
