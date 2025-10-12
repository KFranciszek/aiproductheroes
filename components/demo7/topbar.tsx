"use client";
import { ThemeToggle } from "@/components/demo7/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell } from "lucide-react";
import { Toaster } from "sonner";

export function Topbar() {
  return (
    <div className="h-14 flex items-center justify-between border-b px-4">
      <div className="flex items-center gap-2 w-full max-w-lg">
        <Search size={16} className="text-muted" />
        <Input placeholder="Search (Cmd/Ctrl + K)" className="h-9" />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell size={18} />
        </Button>
        <ThemeToggle />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
