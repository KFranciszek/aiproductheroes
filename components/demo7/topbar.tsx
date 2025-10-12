"use client";
import { ThemeToggle } from "@/components/demo7/theme-toggle";
import { Search, Bell } from "lucide-react";
import { Toaster } from "sonner";

export function Topbar() {
  return (
    <div className="h-14 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#374151] px-4">
      <div className="flex items-center gap-2 w-full max-w-lg">
        <Search size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
        <input
          placeholder="Search (Cmd/Ctrl + K)"
          className="h-9 flex-1 bg-transparent border-none outline-none text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          className="p-2 hover:bg-[#F9FAFB] dark:hover:bg-[#111827] rounded-lg transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
        <ThemeToggle />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
