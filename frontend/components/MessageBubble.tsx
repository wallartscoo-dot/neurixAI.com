"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User } from "lucide-react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
export default function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="flex items-start gap-3 max-w-3xl">
          <div className="rounded-2xl bg-black text-white px-5 py-3 shadow">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <User size={18} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3 max-w-4xl">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
          <Bot size={18} />
        </div>

        <div className="rounded-2xl bg-white border border-gray-200 px-5 py-4 shadow-sm prose prose-sm max-w-none">
          <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");

      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  }}
>
  {content || "Thinking..."}
</ReactMarkdown>
        </div>

      </div>
    </div>
  );
}
