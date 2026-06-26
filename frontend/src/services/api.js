const envUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE =
  envUrl && envUrl.length > 0
    ? envUrl.replace(/\/$/, "")
    : import.meta.env.DEV
      ? "/api"
      : "http://127.0.0.1:8000";

export async function postJson(path, body) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server returned a non-JSON response (${response.status}). Is the backend running?`,
    );
  }

  if (!response.ok) {
    const detail =
      typeof data.detail === "string"
        ? data.detail
        : Array.isArray(data.detail)
          ? data.detail.map((d) => d.msg).join(", ")
          : data.error || response.statusText;
    throw new Error(`${detail} (HTTP ${response.status})`);
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
