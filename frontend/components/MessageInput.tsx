"use client";

import { useRef, useState } from "react";
import { uploadFile } from "@/lib/api";
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
  onSend: (text: string, pdfText?: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

 async function submit() {
  if ((!value.trim() && !selectedFile) || disabled) return;

  if (selectedFile) {
  try {
    const result = await uploadFile(selectedFile);

    onSend(value, result.text);

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setValue("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    return;
  } catch (err) {
    console.error(err);
    return;
  }
}

if (value.trim()) {
  onSend(value.trim(), "");
}

setValue("");

if (textareaRef.current) {
  textareaRef.current.style.height = "auto";
}
}

  return (
    <div className="w-full">
      <div className="rounded-[28px] border border-gray-200 bg-white shadow-lg px-6 py-3 transition-all duration-200 hover:shadow-xl">

        <textarea
  ref={textareaRef}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }}
  onInput={(e) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
  }}
  rows={1}
  placeholder="Message Neurix AI..."
  className="w-full resize-none overflow-hidden bg-transparent text-[16px] leading-6 outline-none placeholder:text-gray-400 max-h-40"
/>

        {selectedFile && (
  <div className="mb-3 flex items-center justify-between rounded-xl bg-gray-100 px-4 py-2">
    <span className="truncate text-sm font-medium">
      📄 {selectedFile.name}
    </span>

    <button
      onClick={() => {
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }}
      className="text-red-500 hover:text-red-700"
    >
      ✕
    </button>
  </div>
)}
        
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">

          <div className="flex items-center gap-3">

           <>
 <input
  ref={fileInputRef}
  type="file"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  }}
/>

  <button
    onClick={() => fileInputRef.current?.click()}
    className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
  >
    <Paperclip size={18} />
  </button>
</>

            <button className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200">
  <span>Neurix AI</span>
  <ChevronDown size={16} />
</button>

          </div>

          <div className="flex items-center gap-3">
            

            <button className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black">
              <Mic size={18} />
            </button>

            <button
              onClick={submit}
              disabled={disabled || (!value.trim() && !selectedFile)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition hover:scale-105 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"         >
              <SendHorizontal size={18} />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
