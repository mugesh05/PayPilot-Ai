"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Bot,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Receipt,
  Users,
  BarChart3,
  BellRing,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#003087] via-[#0070ba] to-[#00cfde] flex items-center justify-center text-white shadow-md shadow-blue-900/20">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            PayPilot <span className="text-blue-600">AI</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">
            Features
          </a>
          <a href="#paypal" className="hover:text-blue-600 transition-colors">
            PayPal Integration
          </a>
          <a href="#ai-assistant" className="hover:text-blue-600 transition-colors">
            AI Co-Pilot
          </a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
            How It Works
          </a>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2">
            Sign In
          </Link>
          <Link href="/dashboard">
            <Button size="sm" variant="primary" className="shadow-sm gap-1.5 text-xs">
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-16 px-6 lg:px-12 overflow-hidden text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>PayPal AI Global Hackathon 2026 Submission</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Your Business Payments. <br />
          <span className="bg-gradient-to-r from-[#003087] via-[#0070ba] to-blue-500 bg-clip-text text-transparent">
            Smarter with AI.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Manage invoices, track PayPal payments, identify overdue accounts, and automate polite or urgent reminder notices with your intelligent AI payment assistant.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link href="/dashboard">
            <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-md gap-2 px-7">
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/invoices/new">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-6">
              Create Sample Invoice
            </Button>
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> PayPal Orders API v2
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" /> Server-side Tool Calling
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Printable PDF Generation
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" /> Instant Sandbox Demo Mode
          </span>
        </div>
      </section>

      {/* 3. Interactive Dashboard Preview Card */}
      <section className="px-6 lg:px-12 max-w-6xl mx-auto pb-24 w-full">
        <div className="rounded-3xl border border-slate-200/90 bg-white shadow-2xl p-4 sm:p-6 ring-1 ring-slate-900/5 overflow-hidden">
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-slate-400 ml-2">paypilot.ai/dashboard</span>
            </div>
            <Badge variant="paypal" className="text-[10px]">
              Live Sandbox Preview
            </Badge>
          </div>

          {/* Mini preview metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Revenue</span>
              <p className="text-xl font-bold text-slate-900 mt-1">$4,500.00</p>
              <span className="text-[10px] text-emerald-600 font-medium">100% Captured</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Pending Orders</span>
              <p className="text-xl font-bold text-slate-900 mt-1">$8,260.00</p>
              <span className="text-[10px] text-sky-600 font-medium">2 Invoices</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Overdue Balance</span>
              <p className="text-xl font-bold text-rose-600 mt-1">$2,800.00</p>
              <span className="text-[10px] text-rose-500 font-medium">Marcus Vance</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Collection Rate</span>
              <p className="text-xl font-bold text-slate-900 mt-1">94%</p>
              <span className="text-[10px] text-blue-600 font-medium">Avg 11 Days</span>
            </div>
          </div>

          {/* Mock Interactive Banner */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#003087] via-[#0070ba] to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-slate-200">
                <span className="font-semibold text-white">AI Suggestion:</span> Invoice INV-2026-0002 for $2,800.00 is 17 days past due. A 1-click urgent reminder is ready for approval.
              </p>
            </div>
            <Link href="/reminders">
              <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold py-1">
                View Notice
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Core Features Grid */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Full-Stack Fintech Capability
            </h2>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">
              Everything Needed to Accelerate Accounts Receivable
            </h3>
            <p className="text-sm text-slate-500 mt-3">
              Designed specifically for freelancers, fast-moving agencies, and high-growth startups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Seamless Invoicing & PDFs</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Issue clean, line-item invoices with decimal-safe tax and discount calculations. Download official printable PDFs in one click.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#0070ba] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">PayPal REST Checkout</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Give clients immediate payment access with genuine PayPal Orders API v2 integration, webhook idempotency, and server-side capture verification.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Conversational AI Co-Pilot</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Query overdue balances, revenue summaries, and client history in plain English with server-grounded tool execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PayPal & AI Sections */}
      <section id="paypal" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <Badge variant="paypal" className="text-xs px-3 py-1">
              PayPal Developer Platform
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Enterprise-Grade PayPal Payment Infrastructure
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              PayPilot AI follows the strict PayPal Orders API v2 protocol: order creation is handled strictly on the backend, checkout URLs and SDK buttons are presented to the payer, and captures are confirmed on the server before updating invoice states.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Server-side OAuth2 token caching
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Idempotent webhook verification and deduplication
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero exposure of client secrets in client bundle
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant PayPal Sandbox demonstration capability
              </li>
            </ul>

            <Link href="/dashboard" className="inline-block pt-2">
              <Button variant="paypal" size="md">
                Experience Sandbox Checkout
              </Button>
            </Link>
          </div>

          <div className="bg-slate-900 text-slate-200 p-6 rounded-3xl font-mono text-xs shadow-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span>POST /api/paypal/create-order</span>
              <span className="text-emerald-400">200 OK</span>
            </div>
            <pre className="text-[11px] text-slate-300 overflow-x-auto">
{`{
  "intent": "CAPTURE",
  "purchase_units": [{
    "reference_id": "inv_01",
    "amount": {
      "currency_code": "USD",
      "value": "4500.00"
    }
  }],
  "status": "APPROVED",
  "capture_id": "CAP-SANDBOX-983214",
  "verification": "VERIFIED_SERVER_SIDE"
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* 6. AI Co-Pilot Spotlight */}
      <section id="ai-assistant" className="py-20 bg-slate-900 text-white px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30">
              <Bot className="w-3.5 h-3.5" />
              Controlled Function Calling
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              An AI Assistant That Actually Works with Real Numbers
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unlike generic chatbots that hallucinate financial figures, PayPilot AI uses controlled server-side tools (`get_overdue_invoices`, `get_revenue_summary`, `generate_payment_reminder`) ensuring every answer matches your actual database records.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every sensitive financial mutation requires human-in-the-loop confirmation before saving to disk.
            </p>

            <Link href="/assistant" className="inline-block pt-2">
              <Button size="md" className="bg-blue-600 hover:bg-blue-500 text-white">
                Launch AI Co-Pilot
              </Button>
            </Link>
          </div>

          {/* Sample AI Dialog */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs font-sans">
            <div className="p-3 bg-slate-800/80 rounded-2xl text-slate-200 self-end max-w-xs ml-auto">
              "Show me all overdue invoices and draft a reminder."
            </div>
            <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl text-slate-100 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-400">
                <Bot className="w-4 h-4" /> PayPilot AI
              </div>
              <p className="leading-relaxed">
                Found 1 overdue invoice: <span className="font-semibold text-white">INV-2026-0002</span> ($2,800.00 USD) for <span className="font-semibold text-white">Marcus Vance</span> (17 days overdue).
              </p>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300 italic text-[11px]">
                "URGENT NOTICE: Invoice INV-2026-0002 ($2,800.00 USD) was due on Oct 24, 2026. Please remit payment via PayPal..."
              </div>
              <div className="flex gap-2 pt-1">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                  Action Ready for Confirmation
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-20 text-center px-6 lg:px-12 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ready to Get Paid Faster?
        </h2>
        <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Experience the modern blend of PayPal REST payments and smart AI automation. Test the live sandbox workflow in seconds.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/dashboard">
            <Button size="lg" variant="primary" className="shadow-lg px-8">
              Open PayPilot AI Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 px-6 lg:px-12 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            <Zap className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="font-bold text-slate-800">PayPilot AI</span>
          <span>• Get Paid Faster. Work Smarter.</span>
        </div>
        <p>© 2026 PayPilot AI. Built for the PayPal AI Global Hackathon.</p>
      </footer>
    </div>
  );
}
