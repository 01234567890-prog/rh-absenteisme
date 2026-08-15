"use client";

import { Search, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-[65px] bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-80">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-50">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
          A
        </div>
      </div>
    </header>
  );
}