"use client";
import { useEffect, useState } from "react";
import { getState, subscribe } from "@/lib/demo7/store";

export default function Page() {
  const [s, setS] = useState(getState());
  useEffect(() => { const unsubscribe = subscribe(setS); return unsubscribe; }, []);
  
  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      okr: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      link: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      gate: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      task: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      settings: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    };
    return colors[type] || colors.settings;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1">Activity & Audit</h2>
        <p className="text-[#6B7280] dark:text-[#9CA3AF]">Recent system events and changes</p>
      </div>
      <div className="bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg shadow-sm">
        <div className="p-6 border-b border-[#E5E7EB] dark:border-[#374151]">
          <h3 className="text-lg font-semibold">Recent Events</h3>
        </div>
        <div className="p-6 space-y-3">
          {s.activities.length === 0 && (
            <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF] p-4 text-center">No events yet</div>
          )}
          {s.activities.map((a) => (
            <div key={a.id} className="p-4 bg-[#F9FAFB] dark:bg-[#111827] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadge(a.type)}`}>{a.type}</span>
                <span className="text-sm">{a.message}</span>
              </div>
              <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] whitespace-nowrap ml-4">
                {new Date(a.at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
