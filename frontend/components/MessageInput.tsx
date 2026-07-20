"use client";

import { useState } from "react";

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
    <div className="border-t border-black/10 p-4">
      <div className="flex items-end gap-2 border border-black/15 rounded-xl px-3 py-2 bg-white">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Message Neurix AI"
          rows={1}
          className="flex-1 resize-none outline-none text-sm bg-transparent"
        />
        <button
          onClick={submit}
          disabled={disabled}
          className="text-sm px-3 py-1 rounded-lg bg-moss text-white disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}
