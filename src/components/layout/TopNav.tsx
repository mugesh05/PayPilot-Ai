"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Plus, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopNavProps {
  onSearch?: (term: string) => void;
}

export function TopNav({ onSearch }: TopNavProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search invoices, clients, order IDs..."
          className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 pl-9 pr-4 py-2 rounded-xl border border-slate-200/80 focus:border-blue-500 focus:outline-none transition-all"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* PayPal Verified Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-100 rounded-full text-xs text-[#0070ba] font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PayPal Sandbox Connected</span>
        </div>

        {/* Notifications Icon */}
        <Link
          href="/reminders"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Notifications & Reminders"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </Link>

        {/* Help */}
        <Link
          href="/settings"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Settings & Help"
        >
          <HelpCircle className="w-4 h-4" />
        </Link>

        {/* Quick Action: New Invoice */}
        <Link href="/invoices/new">
          <Button size="sm" variant="primary" className="gap-1.5">
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
