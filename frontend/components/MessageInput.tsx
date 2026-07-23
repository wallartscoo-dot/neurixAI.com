"use client";

import { useState } from "react";
import {
  Plus,
  Mic,
  Paperclip,
  SendHorizontal,
  ChevronDown,
} from "lucide-react";

export default function MessageInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  function submit() {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <div className="w-full">
      <div className="rounded-3xl border border-gray-200 bg-white shadow-xl p-5">

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={3}
          placeholder="How can I help you today?"
          className="w-full resize-none bg-transparent text-lg outline-none"
        />

        <div className="mt-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button className="rounded-full border p-2 hover:bg-gray-100">
              <Plus size={18} />
            </button>

            <button className="flex items-center gap-2 rounded-full border px-4 py-2 hover:bg-gray-100">
              Groq
              <ChevronDown size={16} />
            </button>

          </div>

          <div className="flex items-center gap-3">

            <button className="rounded-full border p-2 hover:bg-gray-100">
              <Paperclip size={18} />
            </button>

            <button className="rounded-full border p-2 hover:bg-gray-100">
              <Mic size={18} />
            </button>

            <button
              onClick={submit}
              disabled={disabled}
              className="rounded-full bg-black p-3 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              <SendHorizontal size={18} />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
