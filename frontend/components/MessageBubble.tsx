"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  if (role === "user") {
    return (
      <div className="self-end max-w-[70%] bg-white rounded-2xl px-4 py-2 text-sm border border-black/10">
        {content}
      </div>
    );
  }

  return (
    <div className="max-w-[75%] font-voice text-[15px] leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "…"}</ReactMarkdown>
    </div>
  );
}
