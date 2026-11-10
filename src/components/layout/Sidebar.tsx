"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Receipt,
  Users,
  CreditCard,
  BellRing,
  BarChart3,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Assistant", href: "/assistant", icon: Bot, badge: "AI" },
  { label: "Invoices", href: "/invoices", icon: Receipt },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Transactions", href: "/transactions", icon: CreditCard },
  { label: "Reminders", href: "/reminders", icon: BellRing },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0a0f1d] text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800/80 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800/60">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#003087] via-[#0070ba] to-[#00cfde] flex items-center justify-center text-white shadow-md shadow-blue-900/30">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              PayPilot <span className="text-blue-400">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Fintech Operations
            </p>
          </div>
        </Link>
      </div>

      {/* Demo Sandbox Tag */}
      <div className="px-5 py-3 border-b border-slate-800/40 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-300">PayPal Sandbox</span>
        </div>
        <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full font-mono">
          v2.4
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors group",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* AI Assistant Quick Pill Card */}
      <div className="p-4 m-3 rounded-xl bg-gradient-to-b from-blue-950/60 to-slate-900/90 border border-blue-900/40 text-xs">
        <div className="flex items-center gap-1.5 text-blue-300 font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          AI Co-pilot Ready
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          Ask PayPilot to detect overdue invoices or draft personalized reminders.
        </p>
        <Link
          href="/assistant"
          className="mt-2.5 block text-center py-1.5 px-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors"
        >
          Open Assistant
        </Link>
      </div>

      {/* User / Business footer */}
      <div className="p-4 border-t border-slate-800/80 flex items-center gap-3 bg-slate-950/40">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
          AC
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-xs font-semibold text-white truncate">Apex Cloud Labs</p>
          <p className="text-[11px] text-slate-400 truncate">billing@apexcloudlabs.io</p>
        </div>
      </div>
    </aside>
  );
}
