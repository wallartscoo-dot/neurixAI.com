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
      <div className="rounded-[28px] border border-gray-200 bg-white shadow-lg px-6 py-4 transition-all duration-200 hover:shadow-xl">

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
         rows={1}
          placeholder="How can I help you today?"
          className="w-full resize-none bg-transparent text-[16px] leading-7 outline-none placeholder:text-gray-400"
        />

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">

          <div className="flex items-center gap-3">

            <button className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black">
              <Plus size={18} />
            </button>

            <button className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200">
  <span>Neurix AI</span>
  <ChevronDown size={16} />
</button>

          </div>

          <div className="flex items-center gap-3">

            <button className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black">
              <Paperclip size={18} />
            </button>

            <button className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black">
              <Mic size={18} />
            </button>

            <button
              onClick={submit}
              disabled={disabled}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition hover:scale-105 hover:bg-gray-800 disabled:opacity-40"
            >
              <SendHorizontal size={18} />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
