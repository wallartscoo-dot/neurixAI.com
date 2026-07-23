"use client";

import { useTheme } from "next-themes";
import {
  Plus,
  MessageSquare,
  Trash2,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";

type Conversation = {
  id: string;
  title: string;
};

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
            <Sparkles size={20} />
          </div>

          <div>
            <h1 className="font-bold text-lg">Neurix AI</h1>
            <p className="text-xs text-gray-500">
              Your AI Assistant
            </p>
          </div>
        </div>
      </div>

      {/* New Chat */}
      <div className="p-4">
        <button
          onClick={onNew}
          className="w-full rounded-xl bg-black text-white py-3 flex items-center justify-center gap-2 hover:bg-gray-900"
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto px-3">
        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`group flex items-center justify-between rounded-xl px-3 py-3 mb-2 cursor-pointer transition ${
              activeId === c.id
                ? "bg-orange-100"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <MessageSquare size={18} />
              <span className="truncate">{c.title}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(c.id);
              }}
              className="opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
          className="w-full rounded-xl border py-3 flex items-center justify-center gap-2"
        >
          {theme === "dark" ? (
            <>
              <Sun size={18} />
              Light Mode
            </>
          ) : (
            <>
              <Moon size={18} />
              Dark Mode
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
