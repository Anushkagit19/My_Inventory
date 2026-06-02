const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8083";

export async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      typeof data?.detail === "string"
        ? data.detail
        : Array.isArray(data?.detail)
          ? data.detail.map((e) => e.msg).join(", ")
          : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}
