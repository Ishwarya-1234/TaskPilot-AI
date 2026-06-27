const envUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE =
  envUrl && envUrl.length > 0
    ? envUrl.replace(/\/$/, "")
    : import.meta.env.DEV
      ? "/api"
      : "https://taskpilot-ai-backend-nbxs.onrender.com";

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

// Task CRUD API functions
export async function getTasks() {
  const url = `${API_BASE}/tasks`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks (HTTP ${response.status})`);
  }
  return response.json();
}

export async function createTask(task) {
  return postJson("/tasks", task);
}

export async function updateTask(taskId, task) {
  const url = `${API_BASE}/tasks/${taskId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server returned a non-JSON response (${response.status})`);
  }

  if (!response.ok) {
    const detail =
      typeof data.detail === "string"
        ? data.detail
        : data.error || response.statusText;
    throw new Error(`${detail} (HTTP ${response.status})`);
  }

  return data;
}

export async function deleteTask(taskId) {
  const url = `${API_BASE}/tasks/${taskId}`;
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task (HTTP ${response.status})`);
  }

  return response.json();
}

// Chat History API functions
export async function getChatHistory() {
  const url = `${API_BASE}/chat-history`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch chat history (HTTP ${response.status})`);
  }
  return response.json();
}

export async function saveChatMessage(message) {
  const url = `${API_BASE}/chat-history`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error(`Failed to save chat message (HTTP ${response.status})`);
  }

  return response.json();
}

export async function clearChatHistory() {
  const url = `${API_BASE}/chat-history`;
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to clear chat history (HTTP ${response.status})`);
  }

  return response.json();
}
