const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("neurixToken");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function signup(email: string, password: string, name?: string) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Signup failed");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Login failed");
  return res.json();
}

export async function listConversations() {
  const res = await fetch(`${API_URL}/api/conversations`, { headers: authHeaders() });
  return res.json();
}

export async function createConversation() {
  const res = await fetch(`${API_URL}/api/conversations`, {
    method: "POST",
    headers: authHeaders(),
  });
  return res.json();
}

export async function deleteConversation(id: string) {
  await fetch(`${API_URL}/api/conversations/${id}`, {
    method: "DELETE",
    headers:  authHeaders(),
  });
}

export async function getMessages(conversationId: string) {
  const res = await fetch(`${API_URL}/api/conversations/${conversationId}/messages`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function sendMessage(
  conversationId: string,
  content: string,
  onToken: (text: string) => void
) {
  const res = await fetch(
    `${API_URL}/api/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get AI response");
  }

  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      const line = event.split("\n").find((l) => l.startsWith("data: "));
      if (!line) continue;

      try {
        const payload = JSON.parse(line.slice(6));

        if (payload.text) {
          onToken(payload.text);
        }

        if (payload.done) {
          return;
        }
      } catch {}
    }
  }
}
  const res = await fetch(
    `${API_URL}/api/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get AI response");
  }

  return res.json();
}

declare global {
  interface Window {
    __neurixToken?: string;
  }
}
