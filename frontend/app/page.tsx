"use client";

import { useEffect, useState } from "react";

import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MessageBubble from "@/components/MessageBubble";
import MessageInput from "@/components/MessageInput";

import {
  listConversations,
  createConversation,
  deleteConversation,
  getMessages,
  sendMessage,
} from "@/lib/api";

type Message = { role: "user" | "assistant"; content: string };
type Conversation = { id: string; title: string };

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("neurixToken");

  if (!token) {
    window.location.href = "/login";
    return;
  }

  listConversations().then(setConversations);
}, []);

  async function selectConversation(id: string) {
    setActiveId(id);
    const msgs = await getMessages(id);
    setMessages(msgs);
  }

async function newConversation() {
  const conv = await createConversation();
  setConversations((prev) => [conv, ...prev]);
  setActiveId(conv.id);
  setMessages([]);
}

  async function removeConversation(id: string) {
  await deleteConversation(id);

  setConversations((prev) =>
    prev.filter((c) => c.id !== id)
  );

  if (activeId === id) {
    setActiveId(null);
    setMessages([]);
  }
}

async function handleSend(text: string) {
  let conversationId = activeId;

  if (!conversationId) {
    const conv = await createConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    conversationId = conv.id;
  }

  setMessages((prev) => [
    ...prev,
    { role: "user", content: text },
  ]);

  setStreaming(true);

  try {
  await sendMessage(conversationId!, text, (token) => {
    setMessages((prev) => {
      const next = [...prev];
      next[next.length - 1] = {
        role: "assistant",
        content: next[next.length - 1].content + token,
      };
      return next;
    });
  });
} catch (error)
  { 
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "AI response failed",
      },
    ]);
  }

  setStreaming(false);
}

 
  return (
    <div className="flex h-screen bg-bone text-ink">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={selectConversation}
        onNew={newConversation}
        onDelete={removeConversation}
      />

      <main className="flex-1 flex flex-col">
  <Navbar />

  {messages.length === 0 ? (
  <div className="flex-1 flex flex-col items-center justify-center px-6">
    <Hero />
    <div className="w-full max-w-4xl mt-10">
      <MessageInput onSend={handleSend} disabled={streaming} />
    </div>
  </div>
) : (
          <div className="flex-1 overflow-auto p-6 flex flex-col gap-4">
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} content={m.content} />
            ))}
          </div>
        )}

       {messages.length > 0 && (
  <MessageInput onSend={handleSend} disabled={streaming} />
)}
      </main>
    </div>
  );
}
