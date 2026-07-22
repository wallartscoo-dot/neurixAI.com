"use client";

import Link from "next/link";
import { Bot, UserCircle2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full px-8 py-5 flex items-center justify-between border-b border-gray-200 bg-[#FAF9F7]">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
          <Bot size={22} />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Neurix AI
          </h1>
          <p className="text-xs text-gray-500">
            AI Assistant
          </p>
        </div>
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        <button className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition">
          Upgrade
        </button>

        <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition">
          <UserCircle2 size={24} />
        </button>

      </div>
    </header>
  );
}
