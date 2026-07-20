"use client";
import { useTheme } from "next-themes";
type Conversation = { id: string; title: string };

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
    <aside className="w-[260px] shrink-0 bg-white/60 border-r border-black/10 flex flex-col p-3">
      <div className="flex items-center gap-2 px-2 mb-4">
 <span className="font-voice text-lg text-red-600">
  🔥 TEST
</span>
</div>

<div className="mb-4">
  <button
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
  >
    {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>
</div>

      <button
        onClick={onNew}
        className="w-full text-left px-3 py-2 rounded-lg border border-black/10 text-sm mb-4 hover:bg-black/5"
      >
        + New chat
      </button>

      <div className="flex-1 overflow-auto space-y-1">
        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer ${
              c.id === activeId ? "bg-white border border-black/10" : "hover:bg-black/5"
            }`}
          >
            <span className="truncate">{c.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(c.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-xs text-slate"
            >
              delete
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
